import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowForward,
  MdCheck,
  MdCall,
  MdOutlineLocalPharmacy,
  MdOutlineMedicationLiquid,
  MdOutlineAccessibilityNew,
  MdOutlineMedication,
  MdOutlineLightbulb,
  MdOutlineHealthAndSafety,
  MdChevronRight,
  MdAdd,
} from "react-icons/md";

import AppShell, { LangSwitch } from "../../components/Layout/AppShell";
import { Card, CardHead, Button, Badge, Empty } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { useStore, todayKey } from "../../store/useStore";
import { TIPS, PHARMACIES } from "../../data/catalog";
import { useGeo, distanceKm } from "../../hooks/useGeo";
import { haptic, call, openLink } from "../../lib/platform";
import { EMERGENCY_NUMBER } from "../../lib/redFlags";
import "./Home.css";

export default function Home() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const card = useStore((s) => s.activeCard());
  const meds = useStore((s) => s.meds);
  const toggleDose = useStore((s) => s.toggleDose);
  const visits = useStore((s) => s.visits);
  const markVisit = useStore((s) => s.markVisit);
  const newChat = useStore((s) => s.newChat);
  const pushMessage = useStore((s) => s.pushMessage);

  const { location } = useGeo();
  const [ask, setAsk] = useState("");

  useEffect(() => {
    markVisit();
  }, [markVisit]);

  const tip = useMemo(() => TIPS[new Date().getDate() % TIPS.length], []);

  const todayDoses = useMemo(() => {
    const k = todayKey();
    const rows = [];
    meds.forEach((m) => {
      (m.times || []).forEach((time) => {
        rows.push({
          medId: m.id,
          time,
          name: m.name,
          dose: m.dose,
          done: (m.log?.[k] || []).includes(time),
        });
      });
    });
    return rows.sort((a, b) => a.time.localeCompare(b.time));
  }, [meds]);

  const nearest = useMemo(() => {
    const list = PHARMACIES.map((p) => ({
      ...p,
      km: location ? distanceKm(location, { lat: p.lat, lng: p.lng }) : null,
    }));
    if (location) list.sort((a, b) => a.km - b.km);
    return list.slice(0, 2);
  }, [location]);

  const streak = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(visits.includes(d.toISOString().slice(0, 10)));
    }
    return days;
  }, [visits]);

  const cardFilled =
    Boolean(card?.age) && Boolean(card?.sex) && (card?.chronic?.length || card?.allergies);

  const send = () => {
    const text = ask.trim();
    if (!text) {
      navigate("/assistant");
      return;
    }
    const id = newChat();
    pushMessage(id, { role: "user", text });
    haptic();
    navigate("/assistant", { state: { autoSend: true } });
  };

  const quick = [
    {
      icon: <MdOutlineAccessibilityNew />,
      tone: "",
      title: t("nav.checker"),
      sub: t("check.sub"),
      to: "/checker",
    },
    {
      icon: <MdOutlineMedicationLiquid />,
      tone: "mint",
      title: t("med.title"),
      sub: t("med.sub"),
      to: "/medicines",
    },
    {
      icon: <MdOutlineLocalPharmacy />,
      tone: "warn",
      title: t("near.title"),
      sub: t("near.hospSub"),
      to: "/nearby",
    },
    {
      icon: <MdOutlineMedication />,
      tone: "danger",
      title: t("nav.meds"),
      sub: t("meds.sub"),
      to: "/meds",
    },
  ];

  const name = card?.name || "";

  return (
    <AppShell title={t("app.name")} action={<LangSwitch />}>
      <div className="home">
        {/* ---------- hero ---------- */}
        <section className="hero anim-up">
          <div className="hero__hi">
            {t("home.hi")}
            {name ? `, ${name}` : ""} 👋
          </div>
          <h1>{t("home.q")}</h1>

          <div className="hero__ask">
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("home.ask")}
              aria-label={t("home.ask")}
            />
            <button className="hero__send" onClick={send} aria-label={t("common.open")}>
              <MdArrowForward />
            </button>
          </div>

          <div className="hero__meta">
            <span>⚡ {t("login.f2")}</span>
            <span>🔒 {t("login.badge")}</span>
          </div>
        </section>

        {/* ---------- quick ---------- */}
        <section>
          <div className="sect">
            <h2>{t("home.quick")}</h2>
          </div>
          <div className="quick">
            {quick.map((q, i) => (
              <button
                key={q.to}
                className={`quickCard anim-up d${i + 1}`}
                onClick={() => {
                  haptic();
                  navigate(q.to);
                }}
              >
                <div className={`iconbox ${q.tone ? `iconbox--${q.tone}` : ""}`}>{q.icon}</div>
                <div>
                  <b>{q.title}</b>
                  <br />
                  <span>{q.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- columns ---------- */}
        <div className="home__cols">
          <div className="stack gap-16">
            {/* медкарта CTA */}
            {!cardFilled && (
              <div className="ctaCard anim-up">
                <div className="iconbox iconbox--mint iconbox--lg">
                  <MdOutlineHealthAndSafety />
                </div>
                <div className="grow">
                  <h4>{t("home.profileCta")}</h4>
                  <p className="tiny">{t("home.profileCtaSub")}</p>
                </div>
                <Button size="sm" variant="mint" onClick={() => navigate("/onboarding")}>
                  {t("common.continue")}
                </Button>
              </div>
            )}

            {/* лекарства на сегодня */}
            <Card>
              <CardHead
                title={
                  <>
                    <MdOutlineMedication color="var(--brand-500)" size={20} />
                    {t("home.todayMeds")}
                  </>
                }
                action={
                  <Button
                    variant="plain"
                    size="sm"
                    onClick={() => navigate("/meds")}
                    iconRight={<MdChevronRight size={18} />}
                  >
                    {t("common.all")}
                  </Button>
                }
              />
              {todayDoses.length ? (
                <div>
                  {todayDoses.map((d) => (
                    <div
                      key={`${d.medId}-${d.time}`}
                      className={`dose ${d.done ? "dose--done" : ""}`}
                    >
                      <span className="dose__time">{d.time}</span>
                      <div className="grow">
                        <div className="dose__name">{d.name}</div>
                        {d.dose && <div className="dose__dose">{d.dose}</div>}
                      </div>
                      <button
                        className="dose__check"
                        data-on={d.done}
                        aria-label={t("meds.taken")}
                        onClick={() => {
                          haptic("success");
                          toggleDose(d.medId, d.time);
                        }}
                      >
                        <MdCheck size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  icon={<MdOutlineMedication />}
                  title={t("home.noMeds")}
                  action={
                    <Button
                      size="sm"
                      variant="soft"
                      icon={<MdAdd size={18} />}
                      onClick={() => navigate("/meds")}
                    >
                      {t("home.addMed")}
                    </Button>
                  }
                />
              )}
            </Card>

            {/* совет дня */}
            <Card>
              <div className="tip">
                <div className="iconbox iconbox--warn">
                  <MdOutlineLightbulb />
                </div>
                <div>
                  <h4 style={{ marginBottom: 4 }}>{t("home.tipTitle")}</h4>
                  <p>{pick(tip, lang)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="stack gap-16">
            {/* экстренная помощь */}
            <div className="sos anim-up">
              <div className="sos__icon">
                <MdCall />
              </div>
              <div className="grow">
                <h4>{t("home.emergency")}</h4>
                <p>{t("home.emergencySub")}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  haptic("warning");
                  call(EMERGENCY_NUMBER);
                }}
              >
                103
              </Button>
            </div>

            {/* аптеки рядом */}
            <Card>
              <CardHead
                title={
                  <>
                    <MdOutlineLocalPharmacy color="var(--mint-500)" size={20} />
                    {t("home.nearby")}
                  </>
                }
                action={
                  <Button
                    variant="plain"
                    size="sm"
                    onClick={() => navigate("/nearby")}
                    iconRight={<MdChevronRight size={18} />}
                  >
                    {t("common.all")}
                  </Button>
                }
              />
              <div className="stack gap-12">
                {nearest.map((p) => (
                  <div className="row gap-12" key={p.id}>
                    <div className="iconbox iconbox--mint">
                      <MdOutlineLocalPharmacy />
                    </div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</div>
                      <div className="tiny dim" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pick(p.address, lang)}
                      </div>
                    </div>
                    <div className="stack gap-4" style={{ alignItems: "flex-end" }}>
                      {p.open24 && <Badge tone="ok">24/7</Badge>}
                      {p.km != null && (
                        <span className="tiny dim">
                          {p.km.toFixed(1)} {t("common.km")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="soft"
                size="sm"
                block
                style={{ marginTop: 14 }}
                onClick={() =>
                  openLink(
                    `https://yandex.uz/maps/?text=${encodeURIComponent("dorixona apteka")}`
                  )
                }
              >
                {t("ph.route")}
              </Button>
            </Card>

            {/* активность */}
            <Card>
              <div className="streak">
                <span>
                  {streak.filter(Boolean).length} {t("home.streak")}
                </span>
                <div className="streak__dots">
                  {streak.map((on, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span className="streak__dot" data-on={on} key={i} />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
