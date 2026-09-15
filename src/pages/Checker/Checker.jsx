import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineWarningAmber,
  MdOutlineMedicalServices,
  MdOutlineForum,
  MdCall,
  MdRestartAlt,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import BodyMap from "../../components/BodyMap/BodyMap";
import { Card, CardHead, Button, Chip, Segmented, Badge, Empty } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { ZONES, ZONE_ORDER } from "../../data/bodyZones";
import { SPECIALTIES } from "../../data/catalog";
import { useStore } from "../../store/useStore";
import { haptic, call } from "../../lib/platform";
import { EMERGENCY_NUMBER } from "../../lib/redFlags";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Checker.css";

const SEVERITY = [1, 2, 3, 4, 5];

export default function Checker() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  useTelegramBack("/home");

  const newChat = useStore((s) => s.newChat);
  const pushMessage = useStore((s) => s.pushMessage);

  const [side, setSide] = useState("front");
  const [zone, setZone] = useState(null);
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState("d");
  const [done, setDone] = useState(false);

  const labels = useMemo(() => {
    const out = {};
    Object.keys(ZONES).forEach((k) => {
      out[k] = pick(ZONES[k], lang);
    });
    return out;
  }, [lang]);

  const z = zone ? ZONES[zone] : null;
  const spec = z ? SPECIALTIES.find((s) => s.id === z.specialty) : null;

  const durations = [
    { value: "h", label: t("check.dur.h") },
    { value: "d", label: t("check.dur.d") },
    { value: "w", label: t("check.dur.w") },
    { value: "m", label: t("check.dur.m") },
  ];

  const urgent = Boolean(z && (z.alwaysUrgent || severity >= 5));

  const askAssistant = () => {
    const durLabel = durations.find((d) => d.value === duration)?.label;
    const text =
      lang === "uz"
        ? `${labels[zone]} og'riyapti. Og'riq kuchi 5 balldan ${severity}. Davomiyligi: ${durLabel}. Nima bo'lishi mumkin va qaysi shifokorga borishim kerak?`
        : lang === "en"
        ? `I have pain in the ${labels[zone]}. Severity ${severity} out of 5. Duration: ${durLabel}. What could this be and which specialist should I see?`
        : `Болит ${labels[zone].toLowerCase()}. Сила боли ${severity} из 5. Длительность: ${durLabel}. Что это может быть и к какому врачу идти?`;

    const id = newChat();
    pushMessage(id, { role: "user", text });
    haptic();
    navigate("/assistant", { state: { autoSend: true } });
  };

  const reset = () => {
    setZone(null);
    setDone(false);
    setSeverity(3);
    setDuration("d");
  };

  return (
    <AppShell title={t("check.title")}>
      <div className="chk">
        <Card className="chk__map">
          <CardHead
            title={t("check.sub")}
            action={
              <Segmented
                label={t("check.sub")}
                value={side}
                onChange={(v) => {
                  setSide(v);
                  haptic();
                }}
                items={[
                  { value: "front", label: t("check.front") },
                  { value: "back", label: t("check.back") },
                ]}
              />
            }
          />

          <BodyMap
            side={side}
            active={zone}
            labels={labels}
            ariaLabel={t("check.sub")}
            onPick={(id) => {
              setZone(id);
              setDone(false);
              haptic();
            }}
          />

          <div className="chk__chips">
            {ZONE_ORDER.map((id) => (
              <Chip
                key={id}
                on={zone === id}
                onClick={() => {
                  setZone(id);
                  setDone(false);
                  haptic();
                }}
              >
                {labels[id]}
              </Chip>
            ))}
          </div>
        </Card>

        <div className="stack gap-16">
          {!zone && (
            <Card>
              <Empty
                icon={<MdOutlineMedicalServices />}
                title={t("check.pickZone")}
                text={t("check.sub")}
              />
            </Card>
          )}

          {zone && !done && (
            <Card className="anim-up">
              <CardHead title={`${t("check.selected")}: ${labels[zone]}`} />

              <div className="field" style={{ marginBottom: 20 }}>
                <span className="field__label">
                  {t("check.severity")} — {severity}/5
                </span>
                <div className="chk__sev">
                  {SEVERITY.map((s) => (
                    <button
                      key={s}
                      data-on={severity >= s}
                      data-level={s}
                      onClick={() => {
                        setSeverity(s);
                        haptic();
                      }}
                      aria-label={`${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field" style={{ marginBottom: 22 }}>
                <span className="field__label">{t("check.duration")}</span>
                <div className="chk__chips">
                  {durations.map((d) => (
                    <Chip
                      key={d.value}
                      on={duration === d.value}
                      onClick={() => {
                        setDuration(d.value);
                        haptic();
                      }}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <Button block size="lg" onClick={() => { setDone(true); haptic("success"); }}>
                {t("check.analyze")}
              </Button>
            </Card>
          )}

          {zone && done && (
            <>
              {urgent && (
                <Card className="chk__urgent anim-up">
                  <div className="row gap-12" style={{ alignItems: "flex-start" }}>
                    <div className="iconbox iconbox--danger iconbox--lg">
                      <MdOutlineWarningAmber />
                    </div>
                    <div className="grow">
                      <h4 style={{ color: "var(--danger-600)" }}>{t("assist.redflag")}</h4>
                      <p className="small" style={{ marginTop: 6 }}>
                        {pick(z.urgent, lang)}
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<MdCall size={17} />}
                        style={{ marginTop: 12 }}
                        onClick={() => call(EMERGENCY_NUMBER)}
                      >
                        {t("assist.redflagCta")}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="anim-up">
                <CardHead
                  title={t("check.result")}
                  action={
                    <Button variant="plain" size="sm" icon={<MdRestartAlt size={18} />} onClick={reset}>
                      <span className="sr-only">reset</span>
                    </Button>
                  }
                />

                <div className="row gap-8 wrap" style={{ marginBottom: 16 }}>
                  <Badge tone="brand">{labels[zone]}</Badge>
                  <Badge tone={severity >= 4 ? "danger" : severity >= 3 ? "warn" : "ok"}>
                    {severity}/5
                  </Badge>
                  <Badge>{durations.find((d) => d.value === duration)?.label}</Badge>
                </div>

                <div className="chk__block">
                  <h4>{t("check.looked")}</h4>
                  <ul className="chk__list">
                    {pick(z.common, lang).map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="chk__block">
                  <h4>{t("check.toDoctor")}</h4>
                  <div className="chk__spec">
                    <span className="chk__specIcon">{spec?.icon}</span>
                    <div>
                      <b>{pick(spec, lang)}</b>
                      <div className="tiny dim">{t("check.pickSpecialist")}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="soft"
                      onClick={() => navigate("/doctors", { state: { specialty: z.specialty } })}
                    >
                      {t("doc.book")}
                    </Button>
                  </div>
                </div>

                {!urgent && (
                  <div className="chk__block">
                    <h4>{t("check.urgentSigns")}</h4>
                    <p className="small">{pick(z.urgent, lang)}</p>
                  </div>
                )}

                <Button
                  block
                  size="lg"
                  icon={<MdOutlineForum size={19} />}
                  style={{ marginTop: 18 }}
                  onClick={askAssistant}
                >
                  {t("assist.title")}
                </Button>

                <div className="disclaimer" style={{ marginTop: 14 }}>
                  <MdOutlineWarningAmber />
                  <span>{t("assist.disclaimer")}</span>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
