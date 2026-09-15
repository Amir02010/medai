import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineHealthAndSafety,
  MdGroups,
  MdAdd,
  MdDelete,
  MdOutlineFileDownload,
  MdLogout,
  MdAutoAwesome,
  MdDarkMode,
  MdLightMode,
  MdBrightnessAuto,
  MdCheck,
  MdOutlineDeleteForever,
  MdEdit,
  MdOutlineDescription,
  MdOutlinePrivacyTip,
  MdOutlineRestartAlt,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import {
  Card,
  CardHead,
  Button,
  Input,
  Textarea,
  Chip,
  Badge,
  Avatar,
  Sheet,
  Segmented,
} from "../../components/UI";
import { useI18n, LANGS, pick } from "../../i18n";
import { useStore, emptyMedCard } from "../../store/useStore";
import { CHRONIC_OPTIONS } from "../../data/catalog";
import { haptic } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Profile.css";

export default function Profile() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  useTelegramBack("/home");

  const user = useStore((s) => s.user);
  const medCard = useStore((s) => s.medCard);
  const setMedCard = useStore((s) => s.setMedCard);
  const family = useStore((s) => s.family);
  const addMember = useStore((s) => s.addMember);
  const updateMember = useStore((s) => s.updateMember);
  const removeMember = useStore((s) => s.removeMember);
  const activeMemberId = useStore((s) => s.activeMemberId);
  const setActiveMember = useStore((s) => s.setActiveMember);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const plan = useStore((s) => s.plan);
  const signOut = useStore((s) => s.signOut);
  const wipe = useStore((s) => s.wipe);

  const [editCard, setEditCard] = useState(false);
  const [draft, setDraft] = useState(medCard);
  const [addOpen, setAddOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [member, setMember] = useState(emptyMedCard());

  const openEdit = () => {
    setDraft(medCard);
    setEditCard(true);
  };

  const saveCard = () => {
    setMedCard(draft);
    setEditCard(false);
    haptic("success");
    toast(t("common.saved"), "ok");
  };

  const exportData = () => {
    const data = useStore.getState();
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            medCard: data.medCard,
            family: data.family,
            meds: data.meds,
            appointments: data.appointments,
            chats: data.chats,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medai-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    haptic("success");
  };

  const chronicLabels = (ids = []) =>
    ids
      .map((id) => pick(CHRONIC_OPTIONS.find((c) => c.id === id), lang))
      .filter(Boolean);

  const name = medCard.name || user?.name || "";

  return (
    <AppShell title={t("prof.title")}>
      <div className="prof">
        {/* ---------- шапка ---------- */}
        <Card className="prof__head">
          <Avatar name={name || "MedAI"} src={user?.photo} size={64} />
          <div className="grow" style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 20 }}>{name || t("onb.name")}</h2>
            <p className="small">{user?.email || user?.username || t("app.tagline")}</p>
          </div>
          <Badge tone={plan === "free" ? "" : "brand"}>
            {plan === "free" ? t("pro.free") : t("pro.plus")}
          </Badge>
        </Card>

        {plan === "free" && (
          <button className="prof__pro" onClick={() => navigate("/pro")}>
            <div className="iconbox iconbox--lg" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
              <MdAutoAwesome />
            </div>
            <div className="grow">
              <h4>{t("prof.pro")}</h4>
              <p>{t("prof.proSub")}</p>
            </div>
            <span className="prof__proCta">{t("pro.cta")}</span>
          </button>
        )}

        {/* ---------- медкарта ---------- */}
        <Card>
          <CardHead
            title={
              <>
                <MdOutlineHealthAndSafety color="var(--brand-500)" size={20} />
                {t("prof.medcard")}
              </>
            }
            action={
              <Button variant="plain" size="sm" icon={<MdEdit size={17} />} onClick={openEdit}>
                {t("common.edit")}
              </Button>
            }
          />
          <div className="prof__rows">
            <div className="prof__row">
              <span>{t("onb.age")}</span>
              <b>{medCard.age || "—"}</b>
            </div>
            <div className="prof__row">
              <span>{t("onb.sex")}</span>
              <b>{medCard.sex ? t(`onb.sex.${medCard.sex}`) : "—"}</b>
            </div>
            <div className="prof__row">
              <span>{t("onb.chronic")}</span>
              <b>{chronicLabels(medCard.chronic).join(", ") || "—"}</b>
            </div>
            <div className="prof__row">
              <span>{t("onb.allergy")}</span>
              <b>{medCard.allergies || "—"}</b>
            </div>
            <div className="prof__row">
              <span>{t("onb.meds")}</span>
              <b>{medCard.meds || "—"}</b>
            </div>
          </div>
        </Card>

        {/* ---------- семья ---------- */}
        <Card>
          <CardHead
            title={
              <>
                <MdGroups color="var(--mint-500)" size={20} />
                {t("prof.family")}
              </>
            }
            action={
              <Button
                variant="plain"
                size="sm"
                icon={<MdAdd size={18} />}
                onClick={() => {
                  setMemberId(null);
                  setMember(emptyMedCard());
                  setAddOpen(true);
                }}
              >
                {t("common.add")}
              </Button>
            }
          />
          <p className="small" style={{ marginBottom: 14 }}>
            {t("prof.familySub")}
          </p>

          <div className="prof__members">
            <button
              className="prof__member"
              data-on={!activeMemberId}
              onClick={() => {
                setActiveMember(null);
                haptic();
              }}
            >
              <Avatar name={name || "Me"} size={36} />
              <span>{name || t("prof.title")}</span>
              {!activeMemberId && <MdCheck size={17} />}
            </button>

            {family.map((m) => (
              <div className="prof__memberRow" key={m.id}>
                <button
                  className="prof__member grow"
                  data-on={activeMemberId === m.id}
                  onClick={() => {
                    setActiveMember(m.id);
                    haptic();
                  }}
                >
                  <Avatar name={m.name} size={36} />
                  <span>
                    {m.name}
                    {m.age ? ` · ${m.age}` : ""}
                  </span>
                  {activeMemberId === m.id && <MdCheck size={17} />}
                </button>
                <button
                  className="iconBtn"
                  onClick={() => {
                    setMemberId(m.id);
                    setMember({ ...emptyMedCard(), ...m });
                    setAddOpen(true);
                    haptic();
                  }}
                  aria-label={t("prof.editMember")}
                  title={t("prof.editMember")}
                >
                  <MdEdit size={17} />
                </button>
                <button
                  className="iconBtn iconBtn--danger"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    if (window.confirm(t("prof.removeMemberAsk"))) {
                      removeMember(m.id);
                      haptic("warning");
                    }
                  }}
                  aria-label={t("common.delete")}
                  title={t("common.delete")}
                >
                  <MdDelete size={17} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* ---------- настройки ---------- */}
        <Card>
          <CardHead title={t("prof.settings")} />

          <div className="prof__setting">
            <span>{t("prof.lang")}</span>
            <div className="row gap-8 wrap">
              {LANGS.map((l) => (
                <Chip
                  key={l.code}
                  on={lang === l.code}
                  onClick={() => {
                    setLang(l.code);
                    haptic();
                  }}
                >
                  {l.flag} {l.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="prof__setting">
            <span>{t("prof.theme")}</span>
            <Segmented
              label={t("prof.theme")}
              value={theme}
              onChange={(v) => {
                setTheme(v);
                haptic();
              }}
              items={[
                { value: "light", title: t("prof.theme.light"), label: <MdLightMode size={16} /> },
                { value: "dark", title: t("prof.theme.dark"), label: <MdDarkMode size={16} /> },
                { value: "auto", title: t("prof.theme.auto"), label: <MdBrightnessAuto size={16} /> },
              ]}
            />
          </div>
        </Card>

        {/* ---------- документы ---------- */}
        <Card>
          <CardHead title={t("prof.legal")} />
          <div className="stack gap-8">
            <Button
              variant="ghost"
              block
              icon={<MdOutlineDescription size={19} />}
              onClick={() => navigate("/legal/terms")}
            >
              {t("prof.terms")}
            </Button>
            <Button
              variant="ghost"
              block
              icon={<MdOutlinePrivacyTip size={19} />}
              onClick={() => navigate("/legal/privacy")}
            >
              {t("prof.privacy")}
            </Button>
          </div>
        </Card>

        {/* ---------- данные ---------- */}
        <Card>
          <div className="stack gap-8">
            <Button
              variant="ghost"
              block
              icon={<MdOutlineRestartAlt size={19} />}
              onClick={() => navigate("/onboarding")}
            >
              {t("prof.redoOnboarding")}
            </Button>
            <Button
              variant="ghost"
              block
              icon={<MdOutlineFileDownload size={19} />}
              onClick={exportData}
            >
              {t("prof.export")}
            </Button>
            <Button
              variant="ghost"
              block
              icon={<MdLogout size={19} />}
              onClick={() => {
                signOut();
                navigate("/", { replace: true });
              }}
            >
              {t("prof.logout")}
            </Button>
            <Button
              variant="plain"
              block
              icon={<MdOutlineDeleteForever size={19} />}
              style={{ color: "var(--danger-500)" }}
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm(t("prof.wipeConfirm"))) {
                  wipe();
                  navigate("/", { replace: true });
                }
              }}
            >
              {t("prof.wipe")}
            </Button>
          </div>
        </Card>

        <p className="tiny dim center" style={{ padding: "4px 0 8px" }}>
          {t("assist.disclaimer")}
        </p>
      </div>

      {/* ---------- редактор медкарты ---------- */}
      <Sheet
        open={editCard}
        onClose={() => setEditCard(false)}
        title={t("prof.medcard")}
        footer={
          <Button block size="lg" onClick={saveCard}>
            {t("common.save")}
          </Button>
        }
      >
        <div className="stack gap-16">
          <Input
            label={t("onb.name")}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Input
            label={t("onb.age")}
            type="number"
            inputMode="numeric"
            value={draft.age}
            onChange={(e) => setDraft({ ...draft, age: e.target.value })}
          />
          <div className="field">
            <span className="field__label">{t("onb.sex")}</span>
            <div className="row gap-8">
              {["m", "f", "x"].map((s) => (
                <Chip key={s} on={draft.sex === s} onClick={() => setDraft({ ...draft, sex: s })}>
                  {t(`onb.sex.${s}`)}
                </Chip>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="field__label">{t("onb.chronic")}</span>
            <div className="row gap-8 wrap">
              {CHRONIC_OPTIONS.map((c) => (
                <Chip
                  key={c.id}
                  on={draft.chronic?.includes(c.id)}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      chronic: draft.chronic?.includes(c.id)
                        ? draft.chronic.filter((x) => x !== c.id)
                        : [...(draft.chronic || []), c.id],
                    })
                  }
                >
                  {pick(c, lang)}
                </Chip>
              ))}
            </div>
          </div>
          <Textarea
            label={t("onb.allergy")}
            rows={2}
            value={draft.allergies}
            onChange={(e) => setDraft({ ...draft, allergies: e.target.value })}
          />
          <Textarea
            label={t("onb.meds")}
            rows={2}
            value={draft.meds}
            onChange={(e) => setDraft({ ...draft, meds: e.target.value })}
          />
        </div>
      </Sheet>

      {/* ---------- добавить члена семьи ---------- */}
      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={memberId ? t("prof.editMember") : t("prof.addMember")}
        subtitle={t("prof.familySub")}
        footer={
          <Button
            block
            size="lg"
            onClick={() => {
              if (!member.name.trim()) {
                toast(t("onb.name"), "err");
                return;
              }
              if (memberId) updateMember(memberId, member);
              else addMember(member);
              setAddOpen(false);
              setMemberId(null);
              haptic("success");
              toast(t("common.saved"), "ok");
            }}
          >
            {t("common.save")}
          </Button>
        }
      >
        <div className="stack gap-16">
          <Input
            label={t("onb.name")}
            value={member.name}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
          />
          <Input
            label={t("onb.age")}
            type="number"
            inputMode="numeric"
            value={member.age}
            onChange={(e) => setMember({ ...member, age: e.target.value })}
          />
          <Textarea
            label={t("onb.allergy")}
            rows={2}
            value={member.allergies}
            onChange={(e) => setMember({ ...member, allergies: e.target.value })}
          />
        </div>
      </Sheet>
    </AppShell>
  );
}
