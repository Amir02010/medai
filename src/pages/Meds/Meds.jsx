import React, { useMemo, useState } from "react";
import {
  MdAdd,
  MdCheck,
  MdDelete,
  MdOutlineMedication,
  MdNotificationsActive,
  MdOutlineWatchLater,
  MdEdit,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import { Card, CardHead, Button, Input, Chip, Badge, Empty, Sheet, Progress } from "../../components/UI";
import { useI18n } from "../../i18n";
import { useStore, todayKey } from "../../store/useStore";
import { haptic } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Meds.css";

const TIME_PRESETS = ["07:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

export default function Meds() {
  const { t } = useI18n();
  useTelegramBack("/home");

  const meds = useStore((s) => s.meds);
  const addMed = useStore((s) => s.addMed);
  const updateMed = useStore((s) => s.updateMed);
  const removeMed = useStore((s) => s.removeMed);
  const toggleDose = useStore((s) => s.toggleDose);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", dose: "", times: ["08:00"], days: 7 });

  const k = todayKey();

  const adherence = useMemo(() => {
    let total = 0;
    let done = 0;
    meds.forEach((m) => {
      total += (m.times || []).length;
      done += (m.log?.[k] || []).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  }, [meds, k]);

  const toggleTime = (time) => {
    haptic();
    setForm((f) => ({
      ...f,
      times: f.times.includes(time)
        ? f.times.filter((x) => x !== time)
        : [...f.times, time].sort(),
    }));
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", dose: "", times: ["08:00"], days: 7 });
    setOpen(true);
  };

  const openEdit = (m) => {
    setEditId(m.id);
    setForm({ name: m.name, dose: m.dose || "", times: [...(m.times || [])], days: m.days });
    setOpen(true);
    haptic();
  };

  const save = () => {
    if (!form.name.trim()) {
      toast(t("meds.needName"), "err");
      return;
    }
    if (!form.times.length) {
      toast(t("meds.pickTimes"), "err");
      return;
    }
    const payload = { ...form, name: form.name.trim(), dose: form.dose.trim() };
    if (editId) updateMed(editId, payload);
    else addMed(payload);
    haptic("success");
    toast(t("common.saved"), "ok");
    setEditId(null);
    setForm({ name: "", dose: "", times: ["08:00"], days: 7 });
    setOpen(false);
  };

  const endDate = (m) => {
    const d = new Date(m.startedAt);
    d.setDate(d.getDate() + Number(m.days || 0));
    return d.toLocaleDateString();
  };

  return (
    <AppShell
      title={t("meds.title")}
      action={
        <Button size="sm" icon={<MdAdd size={18} />} onClick={openAdd}>
          {t("common.add")}
        </Button>
      }
    >
      <div className="meds">
        {meds.length > 0 && (
          <Card>
            <CardHead
              title={
                <>
                  <MdNotificationsActive color="var(--mint-500)" size={20} />
                  {t("meds.adherence")} · {t("common.today")}
                </>
              }
              action={<Badge tone={adherence >= 70 ? "ok" : adherence >= 40 ? "warn" : "danger"}>{adherence}%</Badge>}
            />
            <Progress value={adherence} />
          </Card>
        )}

        {meds.length === 0 ? (
          <Card>
            <Empty
              icon={<MdOutlineMedication />}
              title={t("meds.empty")}
              text={t("meds.emptySub")}
              action={
                <Button icon={<MdAdd size={18} />} onClick={openAdd}>
                  {t("meds.add")}
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="meds__grid">
            {meds.map((m, i) => {
              const done = m.log?.[k] || [];
              return (
                <Card key={m.id} className={`med anim-up d${Math.min(i + 1, 6)}`}>
                  <div className="med__top">
                    <div className="iconbox">
                      <MdOutlineMedication />
                    </div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <h3>{m.name}</h3>
                      {m.dose && <p className="small">{m.dose}</p>}
                    </div>
                    <button
                      className="iconBtn"
                      onClick={() => openEdit(m)}
                      aria-label={t("meds.edit")}
                      title={t("meds.edit")}
                    >
                      <MdEdit size={17} />
                    </button>
                    <button
                      className="iconBtn iconBtn--danger"
                      onClick={() => {
                        // eslint-disable-next-line no-alert
                        if (window.confirm(t("meds.deleteAsk"))) {
                          removeMed(m.id);
                          haptic("warning");
                        }
                      }}
                      aria-label={t("common.delete")}
                      title={t("common.delete")}
                    >
                      <MdDelete size={17} />
                    </button>
                  </div>

                  <div className="med__times">
                    {(m.times || []).map((time) => {
                      const on = done.includes(time);
                      return (
                        <button
                          key={time}
                          className="med__time"
                          data-on={on}
                          onClick={() => {
                            toggleDose(m.id, time);
                            haptic("success");
                          }}
                        >
                          {on ? <MdCheck size={16} /> : <MdOutlineWatchLater size={16} />}
                          {time}
                        </button>
                      );
                    })}
                  </div>

                  <div className="med__foot">
                    <span className="tiny dim">
                      {t("meds.courseEnds")} {endDate(m)}
                    </span>
                    <Badge tone={done.length === m.times.length ? "ok" : ""}>
                      {done.length}/{m.times.length}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? t("meds.edit") : t("meds.add")}
        subtitle={t("meds.sub")}
        footer={
          <Button block size="lg" onClick={save}>
            {t("common.save")}
          </Button>
        }
      >
        <div className="stack gap-16">
          <Input
            label={t("meds.name")}
            placeholder="Paracetamol"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label={`${t("meds.dose")} (${t("common.optional")})`}
            placeholder="500 mg"
            value={form.dose}
            onChange={(e) => setForm({ ...form, dose: e.target.value })}
          />
          <div className="field">
            <span className="field__label">{t("meds.times")}</span>
            <div className="row gap-8 wrap">
              {TIME_PRESETS.map((time) => (
                <Chip key={time} on={form.times.includes(time)} onClick={() => toggleTime(time)}>
                  {time}
                </Chip>
              ))}
            </div>
          </div>
          <Input
            label={t("meds.days")}
            type="number"
            min="1"
            max="180"
            inputMode="numeric"
            value={form.days}
            onChange={(e) => setForm({ ...form, days: e.target.value })}
          />
        </div>
      </Sheet>
    </AppShell>
  );
}
