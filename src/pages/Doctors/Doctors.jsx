import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdStar, MdSearch, MdOutlineMedicalServices, MdEventAvailable, MdCheckCircle } from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import { Card, Button, Input, Chip, Badge, Avatar, Sheet, Empty } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { DOCTORS, SPECIALTIES } from "../../data/catalog";
import { useStore } from "../../store/useStore";
import { haptic } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Doctors.css";

const money = (n) => `${n.toLocaleString("ru-RU")} so'm`;

export default function Doctors() {
  const { t, lang } = useI18n();
  const routeState = useLocation().state;
  useTelegramBack("/home");

  const appointments = useStore((s) => s.appointments);
  const addAppointment = useStore((s) => s.addAppointment);

  const [spec, setSpec] = useState(routeState?.specialty || "all");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState(null);
  const [slot, setSlot] = useState(null);

  const usedSpecialties = useMemo(() => {
    const ids = new Set(DOCTORS.map((d) => d.specialty));
    return SPECIALTIES.filter((s) => ids.has(s.id));
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DOCTORS.filter((d) => {
      if (spec !== "all" && d.specialty !== spec) return false;
      if (!needle) return true;
      const s = SPECIALTIES.find((x) => x.id === d.specialty);
      return (
        d.name.toLowerCase().includes(needle) ||
        pick(s, lang).toLowerCase().includes(needle) ||
        pick(d.clinic, lang).toLowerCase().includes(needle)
      );
    });
  }, [spec, q, lang]);

  const booked = (id) => appointments.some((a) => a.doctorId === id);

  const confirm = () => {
    if (!picked || !slot) return;
    const s = SPECIALTIES.find((x) => x.id === picked.specialty);
    addAppointment({
      doctorId: picked.id,
      doctorName: picked.name,
      specialty: pick(s, lang),
      when: slot,
    });
    haptic("success");
    toast(t("doc.booked"), "ok");
    setPicked(null);
    setSlot(null);
  };

  return (
    <AppShell title={t("doc.title")}>
      <div className="docs">
        <div className="docs__tools">
          <Input
            icon={<MdSearch />}
            placeholder={t("doc.specialty")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="docs__specs">
            <Chip on={spec === "all"} onClick={() => { setSpec("all"); haptic(); }}>
              {t("common.all")}
            </Chip>
            {usedSpecialties.map((s) => (
              <Chip key={s.id} on={spec === s.id} onClick={() => { setSpec(s.id); haptic(); }}>
                <span>{s.icon}</span>
                {pick(s, lang)}
              </Chip>
            ))}
          </div>
        </div>

        {appointments.length > 0 && (
          <Card className="docs__booked">
            <div className="row gap-12" style={{ alignItems: "flex-start" }}>
              <div className="iconbox iconbox--mint">
                <MdEventAvailable />
              </div>
              <div className="grow">
                <h4>{t("doc.booked")}</h4>
                <div className="stack gap-4" style={{ marginTop: 6 }}>
                  {appointments.map((a) => (
                    <div key={a.id} className="small">
                      <b>{a.when}</b> · {a.doctorName} · {a.specialty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {list.length === 0 ? (
          <Card>
            <Empty icon={<MdOutlineMedicalServices />} title={t("ph.none")} />
          </Card>
        ) : (
          <div className="docs__grid">
            {list.map((d, i) => {
              const s = SPECIALTIES.find((x) => x.id === d.specialty);
              return (
                <Card key={d.id} hover className={`doc anim-up d${Math.min(i + 1, 6)}`}>
                  <div className="doc__top">
                    <Avatar name={d.name.replace("Dr. ", "")} size={54} />
                    <div className="grow" style={{ minWidth: 0 }}>
                      <h3>{d.name}</h3>
                      <p className="small">
                        {s?.icon} {pick(s, lang)}
                      </p>
                    </div>
                    {booked(d.id) && <MdCheckCircle color="var(--ok-500)" size={22} />}
                  </div>

                  <div className="doc__meta">
                    <Badge tone="warn">
                      <MdStar size={12} /> {d.rating} · {d.reviews}
                    </Badge>
                    <Badge>
                      {d.years} {t("doc.exp")}
                    </Badge>
                  </div>

                  <p className="small" style={{ marginTop: 10 }}>
                    {pick(d.clinic, lang)}
                  </p>

                  <div className="doc__foot">
                    <div className="doc__price">{money(d.price)}</div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setPicked(d);
                        setSlot(null);
                        haptic();
                      }}
                    >
                      {t("doc.book")}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Sheet
        open={Boolean(picked)}
        onClose={() => setPicked(null)}
        title={picked?.name}
        subtitle={t("doc.pickTime")}
        footer={
          <Button block size="lg" disabled={!slot} onClick={confirm}>
            {t("doc.book")}
          </Button>
        }
      >
        <div className="doc__slots">
          {picked?.slots.map((s) => (
            <button
              key={s}
              className="doc__slot"
              data-on={slot === s}
              onClick={() => {
                setSlot(s);
                haptic();
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="tiny dim" style={{ marginTop: 14 }}>
          {picked ? `${pick(picked.clinic, lang)} · ${money(picked.price)}` : ""}
        </p>
      </Sheet>
    </AppShell>
  );
}
