import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  MdSend,
  MdImage,
  MdAdd,
  MdOutlineForum,
  MdPerson,
  MdContentCopy,
  MdOutlineWarningAmber,
  MdCall,
  MdOutlineSummarize,
  MdClose,
  MdInfoOutline,
  MdOutlineShield,
  MdDeleteOutline,
  MdSearch,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import Markdown from "../../components/Chat/Markdown";
import { Button, Badge, Sheet } from "../../components/UI";
import Logo from "../../components/Brand/Logo";
import { useI18n, pick } from "../../i18n";
import { useStore } from "../../store/useStore";
import { askAI, buildDoctorSummary, buildPatientContext } from "../../services/aiService";
import { scanRedFlags, EMERGENCY_NUMBER } from "../../lib/redFlags";
import { QUICK_TOPICS } from "../../data/catalog";
import { haptic, call } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Assistant.css";

const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;

export default function Assistant() {
  const { t, lang } = useI18n();
  const routeState = useLocation().state;
  useTelegramBack("/home");

  const chats = useStore((s) => s.chats);
  const activeChatId = useStore((s) => s.activeChatId);
  const newChat = useStore((s) => s.newChat);
  const setActiveChat = useStore((s) => s.setActiveChat);
  const removeChat = useStore((s) => s.removeChat);
  const pushMessage = useStore((s) => s.pushMessage);
  const card = useStore((s) => s.activeCard());

  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flag, setFlag] = useState(null);
  const [summary, setSummary] = useState(null);
  const [demoNotified, setDemoNotified] = useState(false);
  const [chatQuery, setChatQuery] = useState("");

  const scrollRef = useRef(null);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const autoSentRef = useRef(false);

  const chat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [chats, activeChatId]
  );

  const visibleChats = useMemo(() => {
    const q = chatQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        c.messages.some((m) => (m.text || "").toLowerCase().includes(q))
    );
  }, [chats, chatQuery]);
  const messages = chat?.messages || [];

  /* ---------- автоскролл ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, busy]);

  /* ---------- авто-высота поля ---------- */
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  const patient = useMemo(() => buildPatientContext(card, lang), [card, lang]);

  /* ---------- отправка ---------- */
  const run = useCallback(
    async (history, chatId) => {
      setBusy(true);
      try {
        const { text, demo } = await askAI(history, { patient, lang });
        pushMessage(chatId, { role: "ai", text });
        if (demo && !demoNotified) {
          setDemoNotified(true);
          toast(t("assist.offline"), "info");
        }
      } catch {
        pushMessage(chatId, { role: "ai", text: t("err.generic") });
      } finally {
        setBusy(false);
      }
    },
    [patient, lang, pushMessage, t, demoNotified]
  );

  const send = useCallback(
    async (preset) => {
      const text = (preset ?? input).trim();
      if ((!text && !image) || busy) return;

      const chatId = activeChatId || newChat();
      const msg = { role: "user", text: text || t("assist.photo"), image };

      pushMessage(chatId, msg);
      setInput("");
      setImage(null);
      haptic();

      const found = scanRedFlags(text, lang);
      if (found) {
        setFlag(found);
        haptic("warning");
      }

      const current = useStore.getState().chats.find((c) => c.id === chatId);
      await run(current?.messages || [msg], chatId);
    },
    [input, image, busy, activeChatId, newChat, pushMessage, t, lang, run]
  );

  /* ---------- автоотправка с главной ---------- */
  useEffect(() => {
    if (!routeState?.autoSend || autoSentRef.current) return;
    const c = useStore.getState().chats.find((x) => x.id === useStore.getState().activeChatId);
    if (!c || !c.messages.length || c.messages[c.messages.length - 1].role !== "user") return;
    autoSentRef.current = true;
    const last = c.messages[c.messages.length - 1];
    const found = scanRedFlags(last.text, lang);
    if (found) setFlag(found);
    run(c.messages, c.id);
  }, [routeState, run, lang]);

  /* ---------- фото ---------- */
  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast("≤ 3.5 MB", "err");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------- выжимка для врача ---------- */
  const makeSummary = async () => {
    if (!messages.length || busy) return;
    setBusy(true);
    try {
      const { text } = await buildDoctorSummary(messages, { patient, lang });
      setSummary(text);
      haptic("success");
    } catch {
      toast(t("err.generic"), "err");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(t("common.copied"), "ok");
    } catch {
      toast(t("err.generic"), "err");
    }
  };

  return (
    <AppShell
      title={t("assist.title")}
      flush
      action={
        <div className="row gap-8">
          {messages.length > 1 && (
            <Button
              variant="plain"
              size="sm"
              icon={<MdOutlineSummarize size={18} />}
              onClick={makeSummary}
              disabled={busy}
            >
              <span className="sr-only">{t("assist.summary")}</span>
            </Button>
          )}
          <Button
            variant="soft"
            size="sm"
            icon={<MdAdd size={18} />}
            onClick={() => {
              newChat();
              setFlag(null);
              haptic();
            }}
          >
            <span className="hideSm">{t("assist.new")}</span>
          </Button>
        </div>
      }
    >
      <div className="chat">
        {/* ---------- история ---------- */}
        <aside className="chat__side">
          <div className="small" style={{ fontWeight: 700, padding: "2px 4px 8px", color: "var(--text-3)" }}>
            {t("assist.history")}
          </div>
          {chats.length > 4 && (
            <div className="chat__search">
              <MdSearch size={16} />
              <input
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder={t("assist.searchChats")}
                aria-label={t("assist.searchChats")}
              />
            </div>
          )}

          {chats.length === 0 && (
            <div className="tiny dim" style={{ padding: "6px 4px" }}>
              {t("assist.emptySub")}
            </div>
          )}
          {chats.length > 0 && visibleChats.length === 0 && (
            <div className="tiny dim" style={{ padding: "6px 4px" }}>
              {t("ph.none")}
            </div>
          )}

          {visibleChats.map((c) => (
            <div className="chat__row" key={c.id}>
              <button
                className="chat__item"
                data-on={c.id === activeChatId}
                onClick={() => {
                  setActiveChat(c.id);
                  setFlag(null);
                }}
              >
                <MdOutlineForum size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{c.title || t("assist.new")}</span>
              </button>
              <button
                className="chat__del"
                aria-label={t("assist.delete")}
                title={t("assist.delete")}
                onClick={() => {
                  // eslint-disable-next-line no-alert
                  if (window.confirm(t("assist.deleteAsk"))) {
                    removeChat(c.id);
                    haptic("warning");
                  }
                }}
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>
          ))}
        </aside>

        {/* ---------- диалог ---------- */}
        <div className="chat__main">
          <div className="chat__scroll" ref={scrollRef}>
            <div className="chat__inner">
              {flag && (
                <div className="redflag">
                  <div className="redflag__head">
                    <div className="iconbox iconbox--danger">
                      <MdOutlineWarningAmber />
                    </div>
                    <div className="grow">
                      <h4>{t("assist.redflag")}</h4>
                      <ul>
                        {flag.labels.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                      <p>{flag.advice}</p>
                      {!flag.selfharm && (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<MdCall size={17} />}
                          style={{ marginTop: 12 }}
                          onClick={() => call(EMERGENCY_NUMBER)}
                        >
                          {t("assist.redflagCta")}
                        </Button>
                      )}
                    </div>
                    <button
                      className="iconBtn"
                      onClick={() => setFlag(null)}
                      aria-label={t("common.close")}
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              )}

              {messages.length === 0 && !busy && (
                <div className="chat__empty">
                  <Logo size={68} className="chat__emptyMark" />
                  <h2>{t("assist.empty")}</h2>
                  <p className="small" style={{ marginTop: 6, maxWidth: 420, marginInline: "auto" }}>
                    {t("assist.emptySub")}
                  </p>

                  <div className="chat__topics">
                    {QUICK_TOPICS.map((q) => (
                      <button key={q.id} className="chat__topic" onClick={() => send(pick(q, lang))}>
                        <span className="chat__topicIcon">{q.icon}</span>
                        {pick(q, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className={`msg ${m.role === "user" ? "msg--user" : ""}`} key={i}>
                  <div className="msg__ava">
                    {m.role === "user" ? <MdPerson size={17} /> : <Logo size={32} tone="plain" />}
                  </div>
                  <div>
                    <div className="msg__bubble">
                      {m.image && <img className="msg__img" src={m.image} alt="" />}
                      {m.role === "user" ? m.text : <Markdown text={m.text} />}
                    </div>
                    {m.role === "ai" && (
                      <div className="msg__tools">
                        <button className="iconBtn" onClick={() => copy(m.text)}>
                          <MdContentCopy size={13} />
                          {t("common.copy")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="msg">
                  <div className="msg__ava">
                    <Logo size={32} tone="plain" />
                  </div>
                  <div className="msg__bubble">
                    <span className="typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---------- ввод ---------- */}
          <div className="composer">
            <div className="composer__inner">
              {image && (
                <div className="composer__preview">
                  <img src={image} alt="" />
                  <span className="grow">{t("assist.photo")}</span>
                  <button className="iconBtn" onClick={() => setImage(null)}>
                    <MdClose size={16} />
                  </button>
                </div>
              )}

              <div className="composer__box">
                <button
                  className="composer__act"
                  onClick={() => fileRef.current?.click()}
                  aria-label={t("assist.photo")}
                  title={t("assist.photo")}
                >
                  <MdImage size={21} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={pickImage}
                />
                <textarea
                  ref={taRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={t("assist.placeholder")}
                  aria-label={t("assist.placeholder")}
                />
                <button
                  className="composer__send"
                  onClick={() => send()}
                  disabled={busy || (!input.trim() && !image)}
                  aria-label={t("common.open")}
                >
                  <MdSend size={19} />
                </button>
              </div>

              <div className="composer__foot">
                <MdInfoOutline size={14} />
                <span>{t("assist.disclaimer")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- выжимка для врача ---------- */}
      <Sheet
        open={Boolean(summary)}
        onClose={() => setSummary(null)}
        title={t("assist.summary")}
        subtitle={t("assist.summaryDone")}
        footer={
          <div className="row gap-8">
            <Button block icon={<MdContentCopy size={18} />} onClick={() => copy(summary)}>
              {t("common.copy")}
            </Button>
          </div>
        }
      >
        <div className="row gap-8" style={{ marginBottom: 14 }}>
          <Badge tone="brand">
            <MdOutlineShield size={13} /> MedAI
          </Badge>
          <Badge>{new Date().toLocaleDateString()}</Badge>
        </div>
        <Markdown text={summary || ""} />
      </Sheet>
    </AppShell>
  );
}
