import React from "react";
import { MdCheck, MdAutoAwesome, MdStar } from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import { Button, Badge } from "../../components/UI";
import { useI18n } from "../../i18n";
import { useStore } from "../../store/useStore";
import { haptic } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Pro.css";

export default function Pro() {
  const { t, lang } = useI18n();
  useTelegramBack("/profile");

  const plan = useStore((s) => s.plan);
  const setPlan = useStore((s) => s.setPlan);

  const F = {
    ru: {
      free: ["10 вопросов в день", "Аптеки и врачи", "Проверка симптомов", "Напоминания о лекарствах"],
      pro: [
        "Безлимитные вопросы",
        "Разбор фото лекарств и рецептов",
        "Выжимка для врача в один клик",
        "История и экспорт медкарты",
        "Ответы без очереди",
      ],
      fam: ["Всё из Pro", "До 5 медкарт", "Общие напоминания", "Отдельный контекст для каждого"],
    },
    uz: {
      free: ["Kuniga 10 savol", "Dorixona va shifokorlar", "Simptom tekshiruvi", "Dori eslatmalari"],
      pro: [
        "Cheksiz savollar",
        "Dori va retsept rasmini tahlil qilish",
        "Bir bosishda shifokor uchun xulosa",
        "Tarix va tibbiy kartani eksport qilish",
        "Navbatsiz javoblar",
      ],
      fam: ["Pro'dagi hamma narsa", "5 tagacha tibbiy karta", "Umumiy eslatmalar", "Har biri uchun alohida kontekst"],
    },
    en: {
      free: ["10 questions a day", "Pharmacies and doctors", "Symptom checker", "Medicine reminders"],
      pro: [
        "Unlimited questions",
        "Photo analysis of medicines and prescriptions",
        "One-click summary for your doctor",
        "History and health-card export",
        "Priority answers",
      ],
      fam: ["Everything in Pro", "Up to 5 health cards", "Shared reminders", "Separate context for each person"],
    },
  }[lang];

  const plans = [
    { id: "free", title: t("pro.free"), price: "0", features: F.free },
    { id: "pro", title: t("pro.plus"), price: "39 000", features: F.pro, best: true },
    { id: "family", title: t("pro.family"), price: "69 000", features: F.fam },
  ];

  const choose = (id) => {
    setPlan(id);
    haptic("success");
    toast(t("common.saved"), "ok");
  };

  return (
    <AppShell title={t("pro.title")}>
      <div className="pro">
        <div className="pro__head">
          <div className="iconbox iconbox--lg" style={{ margin: "0 auto 14px" }}>
            <MdAutoAwesome />
          </div>
          <h1>{t("pro.title")}</h1>
          <p style={{ marginTop: 8 }}>{t("pro.sub")}</p>
        </div>

        <div className="pro__grid">
          {plans.map((p) => (
            <div key={p.id} className={`pro__card ${p.best ? "pro__card--best" : ""}`}>
              {p.best && (
                <div className="pro__ribbon">
                  <MdStar size={13} /> Best
                </div>
              )}
              <h3>{p.title}</h3>
              <div className="pro__price">
                {p.price}
                <span> so'm / {t("pro.month")}</span>
              </div>

              <ul className="pro__list">
                {p.features.map((f) => (
                  <li key={f}>
                    <MdCheck size={17} />
                    {f}
                  </li>
                ))}
              </ul>

              {plan === p.id ? (
                <Badge tone="ok">{t("pro.current")}</Badge>
              ) : (
                <Button
                  block
                  variant={p.best ? "primary" : "ghost"}
                  onClick={() => choose(p.id)}
                >
                  {t("pro.cta")}
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="tiny dim center" style={{ marginTop: 22 }}>
          {t("assist.disclaimer")}
        </p>
      </div>
    </AppShell>
  );
}
