import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { syncTelegramChrome } from "../lib/platform";

/** Применяет тему к <html> и красит системные панели Telegram. */
export function useTheme() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      const dark = theme === "dark" || (theme === "auto" && prefersDark);
      root.setAttribute("data-theme", dark ? "dark" : "light");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#080d18" : "#f4f8ff");
      syncTelegramChrome(dark);
    };

    apply();

    if (theme !== "auto") return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [theme]);

  return theme;
}
