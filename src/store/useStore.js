import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* Защищённый доступ к localStorage.
   Он может быть недоступен (приватный режим, отключённые куки) или
   содержать мусор после сбоя. В обоих случаях приложение обязано
   открыться — просто с чистого листа, а не белым экраном. */
const safeStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      JSON.parse(raw); // проверяем, что это вообще JSON
      return raw;
    } catch {
      try {
        localStorage.removeItem(name);
      } catch {
        /* нечего чистить */
      }
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* закончилось место или запись запрещена — работаем в памяти */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* пусто */
    }
  },
};

/* ============================================================
   Единое хранилище приложения.
   Всё, что не является секретом, сохраняется в localStorage —
   медкарта, лекарства, история чатов, настройки.
   ============================================================ */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const todayKey = () => new Date().toISOString().slice(0, 10);

function detectInitialLang() {
  try {
    const tg = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
    const raw = (tg || navigator.language || "ru").slice(0, 2).toLowerCase();
    if (raw === "uz") return "uz";
    if (raw === "en") return "en";
    return "ru";
  } catch {
    return "ru";
  }
}

export const emptyMedCard = () => ({
  name: "",
  age: "",
  sex: "",
  chronic: [],
  allergies: "",
  meds: "",
});

export const useStore = create()(
  persist(
    (set, get) => ({
      /* ---------------- настройки ---------------- */
      lang: detectInitialLang(),
      setLang: (lang) => set({ lang }),

      theme: "auto", // light | dark | auto
      setTheme: (theme) => set({ theme }),

      plan: "free", // free | pro | family
      setPlan: (plan) => set({ plan }),

      /* ---------------- пользователь ---------------- */
      user: null,
      setUser: (user) => set({ user }),
      isAuthed: false,
      signIn: (user) => set({ isAuthed: true, user: user || get().user }),
      signOut: () => set({ isAuthed: false }),

      onboarded: false,
      setOnboarded: (v) => set({ onboarded: v }),

      /* ---------------- медкарта + семья ---------------- */
      medCard: emptyMedCard(),
      setMedCard: (patch) => set({ medCard: { ...get().medCard, ...patch } }),

      family: [], // [{ id, name, age, sex, chronic[], allergies, meds }]
      activeMemberId: null, // null = сам пользователь
      addMember: (m) =>
        set({ family: [...get().family, { id: uid(), ...emptyMedCard(), ...m }] }),
      updateMember: (id, patch) =>
        set({
          family: get().family.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }),
      removeMember: (id) =>
        set({
          family: get().family.filter((m) => m.id !== id),
          activeMemberId: get().activeMemberId === id ? null : get().activeMemberId,
        }),
      setActiveMember: (id) => set({ activeMemberId: id }),
      activeCard: () => {
        const { activeMemberId, family, medCard } = get();
        if (!activeMemberId) return medCard;
        return family.find((m) => m.id === activeMemberId) || medCard;
      },

      /* ---------------- регион ---------------- */
      region: null,            // идентификатор области; null = ещё не выбран
      setRegion: (region) => set({ region }),

      /* ---------------- геолокация ---------------- */
      location: null, // { lat, lng }
      geoStatus: "idle", // idle | asking | ok | denied
      setLocation: (lat, lng) => set({ location: { lat, lng }, geoStatus: "ok" }),
      setGeoStatus: (geoStatus) => set({ geoStatus }),

      /* ---------------- чаты ---------------- */
      chats: [], // [{ id, title, createdAt, messages:[{role, text, image?, ts}] }]
      activeChatId: null,

      newChat: () => {
        const id = uid();
        set({
          chats: [
            { id, title: "", createdAt: Date.now(), messages: [] },
            ...get().chats,
          ].slice(0, 40),
          activeChatId: id,
        });
        return id;
      },
      setActiveChat: (id) => set({ activeChatId: id }),
      removeChat: (id) =>
        set({
          chats: get().chats.filter((c) => c.id !== id),
          activeChatId: get().activeChatId === id ? null : get().activeChatId,
        }),
      pushMessage: (chatId, msg) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  title: c.title || (msg.role === "user" ? msg.text.slice(0, 48) : c.title),
                  messages: [...c.messages, { ts: Date.now(), ...msg }],
                }
              : c
          ),
        }),
      currentChat: () => get().chats.find((c) => c.id === get().activeChatId) || null,

      /* ---------------- лекарства и напоминания ---------------- */
      meds: [], // [{ id, name, dose, times:["08:00"], days, startedAt, log:{ "2026-09-12": ["08:00"] } }]
      addMed: (med) =>
        set({
          meds: [
            ...get().meds,
            { id: uid(), startedAt: todayKey(), log: {}, times: [], days: 7, ...med },
          ],
        }),
      updateMed: (id, patch) =>
        set({ meds: get().meds.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      removeMed: (id) => set({ meds: get().meds.filter((m) => m.id !== id) }),
      toggleDose: (id, time) =>
        set({
          meds: get().meds.map((m) => {
            if (m.id !== id) return m;
            const k = todayKey();
            const done = m.log[k] || [];
            const next = done.includes(time)
              ? done.filter((x) => x !== time)
              : [...done, time];
            return { ...m, log: { ...m.log, [k]: next } };
          }),
        }),

      /* ---------------- записи к врачам ---------------- */
      appointments: [], // [{ id, doctorId, doctorName, specialty, when }]
      addAppointment: (a) => set({ appointments: [...get().appointments, { id: uid(), ...a }] }),
      removeAppointment: (id) =>
        set({ appointments: get().appointments.filter((a) => a.id !== id) }),

      /* ---------------- активность ---------------- */
      visits: [], // список дат-ключей
      markVisit: () => {
        const k = todayKey();
        if (get().visits.includes(k)) return;
        set({ visits: [...get().visits, k].slice(-120) });
      },

      /* ---------------- сброс ---------------- */
      wipe: () =>
        set({
          user: null,
          isAuthed: false,
          onboarded: false,
          medCard: emptyMedCard(),
          family: [],
          activeMemberId: null,
          chats: [],
          activeChatId: null,
          meds: [],
          appointments: [],
          visits: [],
          plan: "free",
          region: null,
        }),
    }),
    {
      name: "medai-store-v1",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        plan: s.plan,
        region: s.region,
        user: s.user,
        isAuthed: s.isAuthed,
        onboarded: s.onboarded,
        medCard: s.medCard,
        family: s.family,
        activeMemberId: s.activeMemberId,
        chats: s.chats,
        activeChatId: s.activeChatId,
        meds: s.meds,
        appointments: s.appointments,
        visits: s.visits,
      }),
    }
  )
);

export { todayKey, uid };
