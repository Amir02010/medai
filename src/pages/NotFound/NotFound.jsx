import React from "react";
import { useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";

import { Button } from "../../components/UI";
import Logo from "../../components/Brand/Logo";
import { useI18n } from "../../i18n";
import { useStore } from "../../store/useStore";
import "./NotFound.css";

export default function NotFound() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthed = useStore((s) => s.isAuthed);

  return (
    <div className="nf">
      <div className="nf__inner">
        <Logo size={64} />
        <div className="nf__code">404</div>
        <h1>{t("nf.title")}</h1>
        <p>{t("nf.sub")}</p>
        <Button
          size="lg"
          icon={<MdHome size={19} />}
          onClick={() => navigate(isAuthed ? "/home" : "/", { replace: true })}
          style={{ marginTop: 20 }}
        >
          {t("nf.home")}
        </Button>
      </div>
    </div>
  );
}
