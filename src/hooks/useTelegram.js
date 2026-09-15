import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tgApp, isTelegram, expandTelegram } from "../lib/platform";
import { useStore } from "../store/useStore";

/** Базовая интеграция с Telegram Mini App. Безопасна в обычном браузере. */
export function useTelegram() {
  const tg = tgApp();
  const setUser = useStore((s) => s.setUser);

  const initUser = () => {
    const u = tg?.initDataUnsafe?.user;
    if (u) {
      setUser({
        id: u.id,
        name: [u.first_name, u.last_name].filter(Boolean).join(" "),
        username: u.username,
        photo: u.photo_url,
        source: "telegram",
      });
    }
  };

  return {
    tg,
    inTelegram: isTelegram(),
    initUser,
    expand: expandTelegram,
    close: () => tg?.close?.(),
  };
}

/** Кнопка «назад» Telegram, синхронизированная с роутером. */
export function useTelegramBack(to) {
  const navigate = useNavigate();

  useEffect(() => {
    const tg = tgApp();
    const bb = tg?.BackButton;
    if (!bb) return undefined;

    const handler = () => (to ? navigate(to) : navigate(-1));
    bb.onClick(handler);
    bb.show();

    return () => {
      bb.offClick?.(handler);
      bb.hide?.();
    };
  }, [navigate, to]);
}
