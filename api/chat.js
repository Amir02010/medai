/* ============================================================
   /api/chat — serverless-функция Vercel.
 
   Ключ модели живёт ТОЛЬКО здесь, в переменных окружения.
   В браузер он не попадает никогда.
 
   Настройка в Vercel → Settings → Environment Variables:
     AI_PROVIDER = gemini | anthropic | openai   (по умолчанию gemini)
     AI_API_KEY  = ваш ключ
     AI_MODEL    = (необязательно) конкретная модель
 
   Бесплатный старт: AI_PROVIDER=gemini, ключ с aistudio.google.com.
   Локально: создайте .env.local и запустите `vercel dev`.
   ============================================================ */
 
const LANG_NAME = { ru: "Russian", uz: "Uzbek (Latin script)", en: "English" };
 
/* ---------------------- системный промпт ---------------------- */
 
function systemPrompt({ lang = "ru", patient, mode = "chat" }) {
  const language = LANG_NAME[lang] || LANG_NAME.ru;
 
  const base = `You are MedAI, a careful medical information assistant used in Uzbekistan.
 
ALWAYS answer in ${language}. Never switch language, even if the user mixes languages.
 
Absolute rules:
- You are NOT a doctor and you never state a diagnosis. Talk in terms of "this pattern is often associated with…", never "you have…".
- Never prescribe a specific prescription drug, never give a dosage for a prescription drug, and never tell someone to start or stop a prescribed medicine. For over-the-counter options you may say the category and that the package label must be followed.
- If the described situation could be an emergency (chest pain, breathing difficulty, stroke signs, heavy bleeding, loss of consciousness, severe allergic swelling, suicidal thoughts, a baby who is unresponsive), your FIRST line must tell the person to seek emergency care or call 103, before anything else.
- Never invent clinic names, prices, drug availability, or statistics.
- If the question is outside health, say briefly that you only cover health topics.
 
Style:
- Warm, plain language. No jargon without a short explanation.
- Short sections with markdown **bold** headers and • bullets. Under 250 words unless asked for more.
- End with which specialist to see, and one line reminding that a doctor makes the decision.
- Ask at most 2 follow-up questions, and only when the answer genuinely depends on them.`;
 
  const summary = `You are MedAI in SUMMARY mode. Read the conversation and produce a compact handover note the patient can show to a real doctor.
 
ALWAYS write in ${language}. Use this exact structure with markdown:
**Основное / Asosiy / Main complaint** — one or two sentences in the patient's own words.
**Хронология / Xronologiya / Timeline** — when it started, how it changed.
**Сопутствующее / Qo'shimcha / Context** — age, sex, chronic conditions, allergies, current medicines, if known.
**Что уже пробовали / Nima qilingan / Already tried** — medicines or measures mentioned.
**Вопросы врачу / Shifokorga savollar / Questions for the doctor** — 3 concrete questions.
 
Only include facts the patient actually stated. Write "—" where nothing was said. Do not diagnose, do not recommend treatment. End with one italic line noting it was generated from a MedAI conversation and needs clinical verification.`;
 
  const prompt = mode === "summary" ? summary : base;
  if (!patient) return prompt;
 
  const facts = [];
  if (patient.age) facts.push(`age: ${patient.age}`);
  if (patient.sex) facts.push(`sex: ${patient.sex}`);
  if (patient.chronic?.length) facts.push(`chronic conditions: ${patient.chronic.join(", ")}`);
  if (patient.allergies) facts.push(`allergies: ${patient.allergies}`);
  if (patient.medications) facts.push(`regular medicines: ${patient.medications}`);
  if (!facts.length) return prompt;
 
  return `${prompt}
 
Patient card (provided by the user, take it into account — especially allergies and interactions with their regular medicines):
${facts.map((f) => `- ${f}`).join("\n")}`;
}
 
/* ---------------------- разбор data:URL ---------------------- */
 
function splitImage(dataUrl) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(dataUrl || "");
  return { mediaType: m?.[1] || "image/jpeg", data: m?.[2] || "" };
}
 
/* ---------------------- провайдеры ---------------------- */
 
const PROVIDERS = {
  /* Google Gemini — есть бесплатный тариф */
  gemini: {
    defaultModel: "gemini-2.5-flash",
    build({ model, key, system, messages, maxTokens }) {
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent`,
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: {
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((m) => {
            const parts = [];
            if (m.image) {
              const { mediaType, data } = splitImage(m.image);
              parts.push({ inlineData: { mimeType: mediaType, data } });
            }
            parts.push({ text: m.content || "Что это?" });
            return { role: m.role === "assistant" ? "model" : "user", parts };
          }),
          generationConfig: { temperature: 0.3, maxOutputTokens: maxTokens },
        },
      };
    },
    parse: (data) =>
      (data?.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || "")
        .join("")
        .trim(),
  },
 
  /* Anthropic Claude */
  anthropic: {
    defaultModel: "claude-sonnet-5",
    build({ model, key, system, messages, maxTokens }) {
      return {
        url: "https://api.anthropic.com/v1/messages",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: {
          model,
          max_tokens: maxTokens,
          temperature: 0.3,
          system,
          messages: messages.map((m) => {
            const role = m.role === "assistant" ? "assistant" : "user";
            if (!m.image) return { role, content: m.content };
            const { mediaType, data } = splitImage(m.image);
            return {
              role,
              content: [
                { type: "image", source: { type: "base64", media_type: mediaType, data } },
                { type: "text", text: m.content || "Что это?" },
              ],
            };
          }),
        },
      };
    },
    parse: (data) => (data?.content || []).map((c) => c.text || "").join("").trim(),
  },
 
  /* OpenAI */
  openai: {
    defaultModel: "gpt-5.6-luna",
    build({ model, key, system, messages, maxTokens }) {
      return {
        url: "https://api.openai.com/v1/chat/completions",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: {
          model,
          max_tokens: maxTokens,
          temperature: 0.3,
          messages: [
            { role: "system", content: system },
            ...messages.map((m) => {
              const role = m.role === "assistant" ? "assistant" : "user";
              if (!m.image) return { role, content: m.content };
              return {
                role,
                content: [
                  { type: "text", text: m.content || "Что это?" },
                  { type: "image_url", image_url: { url: m.image } },
                ],
              };
            }),
          ],
        },
      };
    },
    parse: (data) => data?.choices?.[0]?.message?.content?.trim() || "",
  },
};
 
/* ------------------------- rate limit ------------------------- */
 
const bucket = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const hits = (bucket.get(ip) || []).filter((t) => now - t < 60_000);
  hits.push(now);
  bucket.set(ip, hits);
  if (bucket.size > 5000) bucket.clear();
  return hits.length > 20;
}
 
/* --------------------------- handler --------------------------- */
 
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
 
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
 
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests, try again in a minute." });
  }
 
  const key = process.env.AI_API_KEY;
  const providerName = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const provider = PROVIDERS[providerName];
 
  if (!provider) {
    return res.status(500).json({ error: `Unknown AI_PROVIDER: ${providerName}` });
  }
 
  // Ключа нет — честно говорим фронту, он включит демо-режим
  if (!key) {
    return res.status(501).json({
      demo: true,
      reply: "",
      error: "AI_API_KEY is not set. Running in demo mode.",
    });
  }
 
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Bad JSON" });
    }
  }
 
  const { messages = [], lang = "ru", patient = null, mode = "chat" } = body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "messages[] required" });
  }
 
  const trimmed = messages.slice(-14).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 4000),
    image:
      typeof m.image === "string" && m.image.startsWith("data:image") ? m.image : undefined,
  }));
 
  const model = process.env.AI_MODEL || provider.defaultModel;
 
  try {
    const { url, headers, body: payload } = provider.build({
      model,
      key,
      system: systemPrompt({ lang, patient, mode }),
      messages: trimmed,
      maxTokens: mode === "summary" ? 1200 : 900,
    });
 
    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
 
    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("[MedAI] upstream", providerName, upstream.status, detail.slice(0, 400));
 
      /* Короткая причина от провайдера — помогает быстро понять, что не так
         (неверный ключ, снятая с публикации модель, превышен лимит).
         Сам ключ в это сообщение не попадает никогда. */
      let hint = "";
      try {
        hint = JSON.parse(detail)?.error?.message || "";
      } catch {
        hint = detail.slice(0, 200);
      }
 
      return res.status(502).json({
        error: "AI provider error",
        status: upstream.status,
        detail: String(hint).slice(0, 300),
        model,
      });
    }
 
    const data = await upstream.json();
    const reply = provider.parse(data);
 
    if (!reply) return res.status(502).json({ error: "Empty reply from provider" });
 
    return res.status(200).json({ reply, model, demo: false });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[MedAI] handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
};