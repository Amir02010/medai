/* ============================================================
   Service worker MedAI.

   Задача: приложение должно открываться без интернета — медкарта,
   лекарства и история чатов лежат локально и остаются доступны.

   Файлы сборки читаются из asset-manifest.json, который CRA
   создаёт при каждой сборке. Поэтому в кэш попадают все чанки,
   включая подгружаемые по маршрутам, а не только главный файл.

   Запросы к /api/ не кэшируются никогда.
   ============================================================ */

const VERSION = "medai-v2";
const BASE = ["/", "/index.html", "/manifest.json", "/favicon.ico", "/logo192.png"];

async function precache() {
  const cache = await caches.open(VERSION);
  await cache.addAll(BASE).catch(() => undefined);

  try {
    const res = await fetch("/asset-manifest.json", { cache: "no-cache" });
    if (!res.ok) return;
    const manifest = await res.json();
    const files = Object.values(manifest.files || {}).filter(
      (f) => typeof f === "string" && f.startsWith("/") && !f.endsWith(".map")
    );
    // по одному, чтобы один сбойный файл не отменил весь кэш
    await Promise.all(files.map((f) => cache.add(f).catch(() => undefined)));
  } catch {
    /* манифеста нет — обойдёмся кэшированием на лету */
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ответы ИИ не кэшируем никогда
  if (url.pathname.startsWith("/api/")) return;

  // Чужие домены (шрифты) — сеть, при сбое молча пропускаем
  if (url.origin !== self.location.origin) return;

  // Навигация: сеть первой, офлайн — оболочка из кэша
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() =>
          caches.match("/index.html").then((r) => r || caches.match("/"))
        )
    );
    return;
  }

  // Статика: кэш первым, параллельно обновляем
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
