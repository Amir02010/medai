import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MdHome,
  MdOutlineForum,
  MdOutlineMedicalServices,
  MdOutlineMedication,
  MdOutlineMedicationLiquid,
  MdPlace,
  MdPersonOutline,
  MdAutoAwesome,
  MdOutlineAccessibilityNew,
} from "react-icons/md";

import { useI18n, LANGS } from "../../i18n";
import { useStore } from "../../store/useStore";
import { isTelegram, haptic } from "../../lib/platform";
import { Button } from "../UI";
import Logo, { LogoLockup } from "../Brand/Logo";
import Toasts from "./Toasts";
import "./AppShell.css";

const ITEMS = [
  { to: "/home", key: "nav.home", icon: MdHome },
  { to: "/assistant", key: "nav.assistant", icon: MdOutlineForum },
  { to: "/checker", key: "nav.checker", icon: MdOutlineAccessibilityNew },
  { to: "/medicines", key: "med.title", icon: MdOutlineMedicationLiquid },
  { to: "/nearby", key: "near.title", icon: MdPlace },
  { to: "/doctors", key: "nav.doctors", icon: MdOutlineMedicalServices },
  { to: "/meds", key: "nav.meds", icon: MdOutlineMedication },
  { to: "/profile", key: "nav.profile", icon: MdPersonOutline },
];

const TABS = [
  { to: "/home", key: "nav.home", icon: MdHome },
  { to: "/medicines", key: "med.title", icon: MdOutlineMedicationLiquid },
  { to: "/assistant", key: "nav.assistant", icon: MdOutlineForum, fab: true },
  { to: "/nearby", key: "near.title", icon: MdPlace },
  { to: "/profile", key: "nav.profile", icon: MdPersonOutline },
];

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="langSwitch" role="group" aria-label="language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          data-on={lang === l.code}
          onClick={() => {
            setLang(l.code);
            haptic();
          }}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

export default function AppShell({ title, action, flush, children }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const plan = useStore((s) => s.plan);

  return (
    <div className="shell" data-tg={isTelegram()}>
      <aside className="rail">
        <div className="rail__logo">
          <LogoLockup size={40} name={t("app.name")} tagline={t("app.tagline")} />
        </div>

        <nav className="stack gap-4">
          {ITEMS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `navItem ${isActive ? "navItem--on" : ""}`}
              onClick={() => haptic()}
            >
              <Icon />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="rail__spacer" />

        {plan === "free" && (
          <div className="rail__pro">
            <h4>
              <MdAutoAwesome style={{ verticalAlign: "-2px", marginRight: 6 }} />
              MedAI Pro
            </h4>
            <p>{t("prof.proSub")}</p>
            <Button variant="ghost" size="sm" block onClick={() => navigate("/pro")}>
              {t("pro.cta")}
            </Button>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <LangSwitch />
        </div>
      </aside>

      <main className="shell__main">
        {title !== null && (
          <header className="topbar">
            <Logo size={34} className="topbar__mark" />
            <div className="topbar__title">{title || t("app.name")}</div>
            {action}
          </header>
        )}

        <div className={`page ${flush ? "page--flush" : ""}`}>{children}</div>
      </main>

      <nav className="tabbar">
        {TABS.map(({ to, key, icon: Icon, fab }) => {
          const on = location.pathname === to;
          return (
            <button
              key={to}
              className={`tab ${on ? "tab--on" : ""} ${fab ? "tab--fab" : ""}`}
              onClick={() => {
                haptic();
                navigate(to);
              }}
              aria-current={on ? "page" : undefined}
            >
              {fab ? (
                <div className="tab__fab">
                  <Icon />
                </div>
              ) : (
                <>
                  <Icon />
                  <span>{t(key)}</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      <Toasts />
    </div>
  );
}
