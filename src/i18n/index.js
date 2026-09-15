import { DICT, LANGS } from "./dict";
import { useStore } from "../store/useStore";

export { LANGS, DICT };

export function detectLang() {
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

export function translate(lang, key, vars) {
  const table = DICT[lang] || DICT.ru;
  let out = table[key] ?? DICT.ru[key] ?? key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      out = out.replace(new RegExp(`{${k}}`, "g"), vars[k]);
    });
  }
  return out;
}

/** Хук перевода: const { t, lang, setLang } = useI18n() */
export function useI18n() {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const t = (key, vars) => translate(lang, key, vars);
  return { t, lang, setLang };
}

/** Достаёт нужный язык из объекта вида { uz, ru, en } */
export function pick(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.ru || obj.en || obj.uz || "";
}
