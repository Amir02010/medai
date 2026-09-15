/* ============================================================
   Один код — два окружения: Telegram Mini App и обычный браузер.
   ============================================================ */

export function tgApp() {
  try {
    return window.Telegram?.WebApp || null;
  } catch {
    return null;
  }
}

/** Внутри Telegram? (а не просто скрипт подгружен) */
export function isTelegram() {
  const tg = tgApp();
  return Boolean(tg && tg.initData !== undefined && tg.platform && tg.platform !== "unknown");
}

export function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function isTouch() {
  return window.matchMedia?.("(pointer: coarse)").matches;
}

/** Тактильный отклик — в Telegram нативный, в вебе вибрация */
export function haptic(type = "light") {
  const tg = tgApp();
  try {
    if (tg?.HapticFeedback) {
      if (type === "success" || type === "error" || type === "warning") {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
      return;
    }
    if (navigator.vibrate) navigator.vibrate(type === "error" ? [20, 40, 20] : 12);
  } catch {
    /* пусто */
  }
}

/** Открыть ссылку правильно для окружения */
export function openLink(url) {
  const tg = tgApp();
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

export function call(number) {
  window.location.href = `tel:${number}`;
}

/** Красим системные панели Telegram под нашу тему */
export function syncTelegramChrome(isDark) {
  const tg = tgApp();
  if (!tg) return;
  try {
    tg.setHeaderColor?.(isDark ? "#0a1120" : "#f4f8ff");
    tg.setBackgroundColor?.(isDark ? "#080d18" : "#f4f8ff");
  } catch {
    /* старые версии клиента */
  }
}

export function expandTelegram() {
  const tg = tgApp();
  try {
    tg?.ready?.();
    tg?.expand?.();
    tg?.disableVerticalSwipes?.();
  } catch {
    /* пусто */
  }
}
