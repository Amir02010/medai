/* ============================================================
   Клиент ИИ.
   Ходит в собственную serverless-функцию /api/chat — ключ
   модели живёт на сервере и никогда не попадает в браузер.
   Если функции нет (локальный dev без vercel dev) — честный
   демо-режим, чтобы приложение всегда можно было показать.
   ============================================================ */

import { demoReply } from "./demoBrain";

const ENDPOINT = process.env.REACT_APP_API_URL || "/api/chat";
const TIMEOUT = 45000;

/** Собирает контекст пациента для системного промпта */
export function buildPatientContext(card, lang) {
  if (!card) return null;
  const parts = {};
  if (card.name) parts.name = card.name;
  if (card.age) parts.age = card.age;
  if (card.sex) parts.sex = card.sex;
  if (card.chronic?.length) parts.chronic = card.chronic;
  if (card.allergies) parts.allergies = card.allergies;
  if (card.meds) parts.medications = card.meds;
  parts.language = lang;
  return Object.keys(parts).length ? parts : null;
}

/**
 * @param {Array}  messages  [{ role: 'user'|'ai', text, image? }]
 * @param {Object} opts      { patient, lang, mode }
 * @returns {Promise<{text:string, demo:boolean}>}
 */
export async function askAI(messages, opts = {}) {
  const { patient = null, lang = "ru", mode = "chat" } = opts;

  const payload = {
    lang,
    mode,
    patient,
    messages: messages.slice(-14).map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
      image: m.image || undefined,
    })),
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });

    if (res.status === 404 || res.status === 501) {
      // функция не задеплоена или ключ не настроен
      return { text: await demoReply(messages, lang, mode), demo: true };
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    const sources = Array.isArray(data?.sources) ? data.sources : [];
    if (data?.demo) return { text: data.reply, demo: true, sources: [] };
    return { text: data.reply, demo: false, sources };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[MedAI] askAI fallback:", err.message);
    }
    return { text: await demoReply(messages, lang, mode), demo: true };
  } finally {
    clearTimeout(timer);
  }
}

/** Генерирует выжимку диалога для показа врачу */
export async function buildDoctorSummary(messages, opts = {}) {
  return askAI(messages, { ...opts, mode: "summary" });
}
