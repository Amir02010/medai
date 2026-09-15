import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaTelegramPlane, FaApple } from "react-icons/fa";
import {
  MdEmail,
  MdLockOutline,
  MdArrowForward,
  MdShield,
  MdOutlineAccessTime,
  MdOutlineMedicalServices,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import { Button, Input, Divider } from "../../components/UI";
import Logo from "../../components/Brand/Logo";
import { LangSwitch } from "../../components/Layout/AppShell";
import { useI18n } from "../../i18n";
import { useStore } from "../../store/useStore";
import { useTelegram } from "../../hooks/useTelegram";
import { haptic } from "../../lib/platform";
import { toast } from "../../lib/toast";
import "./Login.css";

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const signIn = useStore((s) => s.signIn);
  const onboarded = useStore((s) => s.onboarded);
  const { inTelegram, initUser } = useTelegram();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const go = () => navigate(onboarded ? "/home" : "/onboarding", { replace: true });

  const submit = (e) => {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErr(t("login.err"));
      haptic("error");
      return;
    }
    setErr("");
    setBusy(true);
    // Демо-вход. Здесь подключается реальный провайдер (Supabase / свой бэкенд).
    setTimeout(() => {
      signIn({ name: email.split("@")[0], email, source: "email" });
      haptic("success");
      setBusy(false);
      go();
    }, 550);
  };

  const guest = () => {
    signIn({ name: "", source: "guest" });
    haptic();
    go();
  };

  const telegram = () => {
    initUser();
    signIn(useStore.getState().user || { name: "", source: "telegram" });
    haptic("success");
    go();
  };

  return (
    <div className="auth">
      <div className="auth__blob auth__blob--1" />
      <div className="auth__blob auth__blob--2" />

      <div className="auth__box">
        {/* ---------------- HERO ---------------- */}
        <section className="auth__hero">
          <div className="auth__grid" />
          <div className="auth__ring auth__ring--1" />
          <div className="auth__ring auth__ring--2" />
          <div className="auth__ring auth__ring--3" />

          <div className="auth__live">
            <span className="auth__dot" />
            24/7 online
          </div>

          <div className="auth__brand">
            <Logo size={46} tone="glass" />
            <div>
              <div className="auth__brandName">{t("app.name")}</div>
              <div className="auth__brandTag">{t("app.tagline")}</div>
            </div>
          </div>

          <div className="auth__heroBody">
            <h1>{t("login.hero")}</h1>
            <p>{t("login.heroSub")}</p>

            <div className="auth__stats">
              <div className="auth__stat">
                <b>3</b>
                <span>UZ · RU · EN</span>
              </div>
              <div className="auth__stat">
                <b>&lt;10s</b>
                <span>{t("login.f2")}</span>
              </div>
              <div className="auth__stat">
                <b>103</b>
                <span>{t("home.emergency")}</span>
              </div>
            </div>

            <div className="auth__glass">
              <div className="auth__glassIcon">
                <MdShield />
              </div>
              <div>
                <h4>{t("login.f1")}</h4>
                <p>{t("login.badge")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FORM ---------------- */}
        <section className="auth__form">
          <div className="auth__formTop">
            <LangSwitch />
          </div>

          <form className="auth__card" onSubmit={submit}>
            <Logo size={56} className="auth__mark" />

            <h2>{t("login.title")}</h2>
            <p>{t("login.sub")}</p>

            <div className="auth__fields">
              <Input
                type="text"
                autoComplete="username"
                placeholder={t("login.email")}
                icon={<MdEmail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("login.password")}
                icon={<MdLockOutline />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={err}
                action={
                  <button
                    type="button"
                    className="inputWrap__btn"
                    onClick={() => setShow((v) => !v)}
                    aria-label="toggle password"
                  >
                    {show ? <MdVisibilityOff size={19} /> : <MdVisibility size={19} />}
                  </button>
                }
              />

              <div className="auth__row">
                <label className="auth__remember">
                  <input type="checkbox" defaultChecked />
                  {t("login.remember")}
                </label>
                <a className="auth__forgot" href="#forgot" onClick={(e) => e.preventDefault()}>
                  {t("login.forgot")}
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                block
                loading={busy}
                iconRight={<MdArrowForward size={20} />}
              >
                {t("login.enter")}
              </Button>

              <Divider>{t("login.or")}</Divider>

              {inTelegram ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  block
                  icon={<FaTelegramPlane size={19} color="#2AABEE" />}
                  onClick={telegram}
                >
                  {t("login.tg")}
                </Button>
              ) : (
                <div className="auth__social">
                  <button type="button" onClick={guest} aria-label="Google">
                    <FaGoogle />
                  </button>
                  <button type="button" onClick={guest} aria-label="Apple">
                    <FaApple />
                  </button>
                  <button type="button" onClick={guest} aria-label="Facebook">
                    <FaFacebookF />
                  </button>
                  <button type="button" onClick={telegram} aria-label="Telegram">
                    <FaTelegramPlane />
                  </button>
                </div>
              )}

              <Button type="button" variant="plain" block onClick={guest}>
                {t("login.guest")}
              </Button>
            </div>

            <div className="auth__reg">
              {t("login.noAccount")}
              <button
                type="button"
                onClick={() => toast(t("login.register") + " — demo", "info")}
              >
                {t("login.register")}
              </button>
            </div>

            <div className="auth__features">
              {[
                { icon: <MdShield />, title: t("login.f1"), text: t("login.f1s") },
                { icon: <MdOutlineAccessTime />, title: t("login.f2"), text: t("login.f2s") },
                { icon: <MdOutlineMedicalServices />, title: t("login.f3"), text: t("login.f3s") },
              ].map((f) => (
                <div className="auth__feature" key={f.title}>
                  <div className="iconbox">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
