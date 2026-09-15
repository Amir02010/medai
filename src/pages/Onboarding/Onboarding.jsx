import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPersonOutline,
  MdCake,
  MdLockOutline,
  MdArrowForward,
  MdArrowBack,
  MdOutlineVaccines,
} from "react-icons/md";

import { Button, Input, Chip, Progress, Textarea } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { useStore } from "../../store/useStore";
import { CHRONIC_OPTIONS } from "../../data/catalog";
import { haptic } from "../../lib/platform";
import "./Onboarding.css";

const STEPS = 3;

export default function Onboarding() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const medCard = useStore((s) => s.medCard);
  const setMedCard = useStore((s) => s.setMedCard);
  const setOnboarded = useStore((s) => s.setOnboarded);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(medCard);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleChronic = (id) => {
    haptic();
    set({
      chronic: form.chronic.includes(id)
        ? form.chronic.filter((c) => c !== id)
        : [...form.chronic, id],
    });
  };

  const finish = () => {
    setMedCard(form);
    setOnboarded(true);
    haptic("success");
    navigate("/home", { replace: true });
  };

  const next = () => {
    haptic();
    if (step === STEPS - 1) finish();
    else setStep((s) => s + 1);
  };

  return (
    <div className="onb">
      <div className="onb__card anim-up">
        <div className="onb__top">
          <div className="iconbox iconbox--lg">
            <MdOutlineVaccines />
          </div>
          <span className="onb__step">
            {t("onb.step")} {step + 1} {t("common.of")} {STEPS}
          </span>
        </div>

        <Progress value={((step + 1) / STEPS) * 100} />

        <div style={{ marginTop: 20 }}>
          <h2>{t("onb.title")}</h2>
          <p className="small" style={{ marginTop: 6 }}>
            {t("onb.sub")}
          </p>
        </div>

        <div className="onb__body">
          {step === 0 && (
            <>
              <Input
                label={t("onb.name")}
                icon={<MdPersonOutline />}
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Amir"
              />
              <Input
                label={t("onb.age")}
                icon={<MdCake />}
                type="number"
                min="0"
                max="120"
                inputMode="numeric"
                value={form.age}
                onChange={(e) => set({ age: e.target.value })}
                placeholder="27"
              />
              <div className="field">
                <span className="field__label">{t("onb.sex")}</span>
                <div className="onb__sex">
                  {[
                    { id: "m", label: t("onb.sex.m") },
                    { id: "f", label: t("onb.sex.f") },
                    { id: "x", label: t("onb.sex.x") },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      data-on={form.sex === o.id}
                      onClick={() => {
                        haptic();
                        set({ sex: o.id });
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="field">
              <span className="field__label">{t("onb.chronic")}</span>
              <span className="field__hint" style={{ marginBottom: 6 }}>
                {t("onb.chronicHint")}
              </span>
              <div className="onb__chips">
                {CHRONIC_OPTIONS.map((c) => (
                  <Chip
                    key={c.id}
                    on={form.chronic.includes(c.id)}
                    onClick={() => toggleChronic(c.id)}
                  >
                    {pick(c, lang)}
                  </Chip>
                ))}
                <Chip
                  on={form.chronic.length === 0}
                  onClick={() => {
                    haptic();
                    set({ chronic: [] });
                  }}
                >
                  {t("onb.none")}
                </Chip>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <Textarea
                label={t("onb.allergy")}
                hint={t("onb.allergyHint")}
                rows={3}
                value={form.allergies}
                onChange={(e) => set({ allergies: e.target.value })}
              />
              <Textarea
                label={`${t("onb.meds")} (${t("common.optional")})`}
                rows={3}
                value={form.meds}
                onChange={(e) => set({ meds: e.target.value })}
              />
            </>
          )}
        </div>

        <div className="onb__nav">
          {step > 0 && (
            <Button
              variant="ghost"
              icon={<MdArrowBack size={19} />}
              onClick={() => setStep((s) => s - 1)}
            >
              {t("common.back")}
            </Button>
          )}
          <Button block onClick={next} iconRight={<MdArrowForward size={19} />}>
            {step === STEPS - 1 ? t("onb.finish") : t("common.next")}
          </Button>
        </div>

        <button
          type="button"
          className="btn btn--plain btn--block"
          style={{ marginTop: 8 }}
          onClick={() => {
            setOnboarded(true);
            navigate("/home", { replace: true });
          }}
        >
          {t("common.skip")}
        </button>

        <div className="onb__privacy">
          <MdLockOutline size={15} />
          <span>{t("onb.privacy")}</span>
        </div>
      </div>
    </div>
  );
}
