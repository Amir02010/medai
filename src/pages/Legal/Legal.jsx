import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdOutlineWarningAmber } from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import { Card, Button } from "../../components/UI";
import { useI18n } from "../../i18n";
import { TERMS, PRIVACY, LEGAL_UPDATED, COMPANY } from "../../data/legal";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Legal.css";

export default function Legal() {
  const { doc } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  useTelegramBack("/profile");

  const isPrivacy = doc === "privacy";
  const source = isPrivacy ? PRIVACY : TERMS;
  const sections = source[lang] || source.ru;
  const title = isPrivacy ? t("prof.privacy") : t("prof.terms");

  return (
    <AppShell title={title}>
      <div className="legal">
        <Button
          variant="plain"
          icon={<MdArrowBack size={19} />}
          onClick={() => navigate(-1)}
          className="legal__back"
        >
          {t("legal.back")}
        </Button>

        <Card pad="lg">
          <h1 className="legal__h1">{title}</h1>
          <p className="tiny dim" style={{ marginTop: 6 }}>
            {t("legal.updated")}: {LEGAL_UPDATED}
          </p>

          {!isPrivacy && (
            <div className="disclaimer" style={{ marginTop: 18 }}>
              <MdOutlineWarningAmber />
              <span>{t("assist.disclaimer")}</span>
            </div>
          )}

          {sections.map((sec) => (
            <section className="legal__sec" key={sec.h}>
              <h2>{sec.h}</h2>
              {sec.p.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </section>
          ))}

          <p className="legal__contact">
            {COMPANY.name} · <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
