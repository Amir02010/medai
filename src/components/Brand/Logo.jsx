import React from "react";
import "./Logo.css";

/* ============================================================
   ЛОГОТИП — единственное место, где он задаётся.

   Сейчас используется src/assets/logo.webp.

   Чтобы заменить: положите новый файл в src/assets/ и поправьте
   строку import ниже — логотип обновится сразу везде: боковая
   панель, шапка, экран входа, аватар в чате, пустой чат, 404.

   Файлов два: logo.webp — полный знак, logo-compact.webp — плотный
   кадр для размеров до 40px (аватар в чате). Оба содержат свой фон,
   поэтому фирменная плитка под ними не рисуется (класс .logo--img
   в Logo.css). Если поставите прозрачный SVG — удалите этот класс,
   и плитка вернётся.

   Иконки для вкладки браузера и установки на телефон лежат отдельно,
   в public/ (favicon.ico, logo192.png, logo512.png, logo-maskable.png,
   apple-touch-icon.png, og.png) — их пересобирают из того же исходника.
   ============================================================ */

import logoSrc from "../../assets/logo.webp";
import logoCompactSrc from "../../assets/logo-compact.webp";

const CUSTOM = logoSrc;
/* В мелком размере полный знак превращается в пятно, поэтому для
   аватара в чате и иконок до 40px берём плотный кадр — только робот. */
const CUSTOM_COMPACT = logoCompactSrc;
const COMPACT_UNTIL = 40;

/** Встроенный знак — используется, пока не подставлен свой файл */
function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M32 49.5s-15.2-9.3-15.2-20A9.3 9.3 0 0 1 32 23.6a9.3 9.3 0 0 1 15.2 5.9c0 10.7-15.2 20-15.2 20z"
        fill="currentColor"
        opacity=".95"
      />
      <path
        d="M19 34.5h7.4l3.1-6.4 4.3 12.8 3.2-6.4H45"
        fill="none"
        stroke="var(--logo-ink, #1a5cc8)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {number} size   сторона в пикселях
 * @param {string} tone   "brand" — синяя плитка, "plain" — без подложки,
 *                        "glass" — полупрозрачная (на цветном фоне)
 */
export default function Logo({ size = 40, tone = "brand", className = "" }) {
  const radius = Math.round(size * 0.3);
  const src = size <= COMPACT_UNTIL ? CUSTOM_COMPACT || CUSTOM : CUSTOM;

  return (
    <span
      className={`logo logo--${tone} ${CUSTOM ? "logo--img" : ""} ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {src ? <img src={src} alt="" width={size} height={size} /> : <Mark />}
    </span>
  );
}

/** Логотип со словесной частью — для шапок и экрана входа */
export function LogoLockup({ size = 40, tone = "brand", name = "MedAI", tagline }) {
  return (
    <span className="logoLockup">
      <Logo size={size} tone={tone} />
      <span className="logoLockup__text">
        <span className="logoLockup__name">{name}</span>
        {tagline && <span className="logoLockup__tag">{tagline}</span>}
      </span>
    </span>
  );
}
