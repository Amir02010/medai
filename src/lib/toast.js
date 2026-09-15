import { create } from "zustand";

let seq = 0;

export const useToasts = create((set, get) => ({
  items: [],
  push: (text, tone = "ok", ttl = 2600) => {
    const id = ++seq;
    set({ items: [...get().items, { id, text, tone }] });
    setTimeout(() => set({ items: get().items.filter((i) => i.id !== id) }), ttl);
  },
}));

export const toast = (text, tone) => useToasts.getState().push(text, tone);
