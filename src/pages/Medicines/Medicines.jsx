import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdOutlineMedication,
  MdPublic,
  MdPlace,
  MdDirections,
  MdCall,
  MdInfoOutline,
  MdOutlineWarningAmber,
  MdAdd,
  MdOutlineForum,
  MdStorefront,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import RegionPicker from "../../components/RegionPicker";
import { Card, Button, Input, Chip, Badge, Empty, Sheet } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { useStore } from "../../store/useStore";
import { MEDICINES, MED_CATEGORIES, medName, priceRange } from "../../data/medicines";
import { pharmaciesWithMed } from "../../data/catalog";
import { regionById } from "../../data/regions";
import { useGeo, distanceKm } from "../../hooks/useGeo";
import { haptic, openLink, call } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Medicines.css";

const money = (n, lang) => {
  const unit = lang === "uz" ? "so'm" : lang === "en" ? "UZS" : "сум";
  return `${n.toLocaleString("ru-RU")} ${unit}`;
};

export default function Medicines() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  useTelegramBack("/home");

  const region = useStore((s) => s.region);
  const addMed = useStore((s) => s.addMed);
  const newChat = useStore((s) => s.newChat);
  const pushMessage = useStore((s) => s.pushMessage);
  const { location } = useGeo();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [picked, setPicked] = useState(null);
  const [wholeCountry, setWholeCountry] = useState(false);

  /* ---------- список препаратов ---------- */
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MEDICINES.filter((m) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (!needle) return true;
      return (
        m.name.toLowerCase().includes(needle) ||
        (m.nameUz || "").toLowerCase().includes(needle) ||
        m.inn.toLowerCase().includes(needle)
      );
    }).map((m) => ({
      ...m,
      localCount: pharmaciesWithMed(m.id, region).length,
      totalCount: pharmaciesWithMed(m.id).length,
    }));
  }, [q, cat, region]);

  /* ---------- аптеки для выбранного препарата ---------- */
  const offers = useMemo(() => {
    if (!picked) return { local: [], other: [] };
    const all = pharmaciesWithMed(picked.id);
    const withDistance = all.map((o) => ({
      ...o,
      km: location ? distanceKm(location, { lat: o.pharmacy.lat, lng: o.pharmacy.lng }) : null,
    }));
    return {
      local: region ? withDistance.filter((o) => o.pharmacy.region === region) : withDistance,
      other: region ? withDistance.filter((o) => o.pharmacy.region !== region) : [],
    };
  }, [picked, region, location]);

  const openMed = (m) => {
    setPicked(m);
    setWholeCountry(false);
    haptic();
  };

  const route = (ph) => {
    haptic();
    openLink(
      `https://yandex.uz/maps/?rtext=${location ? `${location.lat},${location.lng}~` : ""}${ph.lat},${ph.lng}&rtt=auto`
    );
  };

  const addToKit = (m) => {
    addMed({ name: medName(m, lang), dose: m.dose, times: ["08:00"], days: 7 });
    haptic("success");
    toast(t("common.saved"), "ok");
  };

  const askAi = (m) => {
    const name = medName(m, lang);
    const text =
      lang === "uz"
        ? `${name} (${m.inn}) haqida gapirib bering: nima uchun, qanday ichiladi, nimaga e'tibor berish kerak?`
        : lang === "en"
        ? `Tell me about ${name} (${m.inn}): what it is for, how it is taken, and what to watch out for.`
        : `Расскажите про ${name} (${m.inn}): от чего он, как принимают и на что обратить внимание?`;
    const id = newChat();
    pushMessage(id, { role: "user", text });
    haptic();
    navigate("/assistant", { state: { autoSend: true } });
  };

  const renderOffers = (rows) =>
    rows.map((o, i) => (
      <div className="offer" key={o.pharmacy.id}>
        <div className="offer__main">
          <div className="offer__name">
            {o.pharmacy.name}
            {i === 0 && rows.length > 1 && (
              <Badge tone="ok">{t("med.cheapest")}</Badge>
            )}
          </div>
          <div className="offer__addr">{pick(o.pharmacy.address, lang)}</div>
          <div className="offer__meta">
            {o.pharmacy.open24 && <Badge tone="ok">24/7</Badge>}
            {o.km != null && (
              <span className="tiny dim">
                {o.km.toFixed(1)} {t("common.km")}
              </span>
            )}
            {!region && (
              <span className="tiny dim">
                {pick(regionById(o.pharmacy.region), lang)}
              </span>
            )}
          </div>
        </div>

        <div className="offer__side">
          <div className="offer__price">{money(o.price, lang)}</div>
          <div className="offer__acts">
            <button
              className="iconBtn"
              onClick={() => route(o.pharmacy)}
              aria-label={t("ph.route")}
              title={t("ph.route")}
            >
              <MdDirections size={17} />
            </button>
            <button
              className="iconBtn"
              onClick={() => call(o.pharmacy.phone)}
              aria-label={t("ph.call")}
              title={t("ph.call")}
            >
              <MdCall size={17} />
            </button>
          </div>
        </div>
      </div>
    ));

  return (
    <AppShell title={t("med.title")} action={<RegionPicker compact />}>
      <div className="meds2">
        <div className="meds2__tools">
          <Input
            icon={<MdSearch />}
            placeholder={t("med.search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("med.search")}
          />
          <div className="meds2__cats">
            <Chip on={cat === "all"} onClick={() => { setCat("all"); haptic(); }}>
              {t("med.all")}
            </Chip>
            {MED_CATEGORIES.map((c) => (
              <Chip key={c.id} on={cat === c.id} onClick={() => { setCat(c.id); haptic(); }}>
                <span>{c.icon}</span>
                {pick(c, lang)}
              </Chip>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <Card>
            <Empty icon={<MdOutlineMedication />} title={t("med.none")} text={t("med.noneSub")} />
          </Card>
        ) : (
          <div className="meds2__grid">
            {list.map((m, i) => (
              <button
                key={m.id}
                className={`medCard anim-up d${Math.min(i + 1, 6)}`}
                onClick={() => openMed(m)}
              >
                <div className="medCard__top">
                  <div className="iconbox">
                    <MdOutlineMedication />
                  </div>
                  <div className="medCard__names">
                    <b>{medName(m, lang)}</b>
                    <span>{m.dose}</span>
                  </div>
                </div>

                <div className="medCard__price">{priceRange(m, lang)}</div>

                <div className="medCard__meta">
                  {m.rx ? (
                    <Badge tone="warn">{t("med.rx")}</Badge>
                  ) : (
                    <Badge tone="ok">{t("med.otc")}</Badge>
                  )}
                  {m.localCount > 0 ? (
                    <Badge tone="brand">
                      <MdStorefront size={12} />
                      {m.localCount === 1
                        ? t("med.inPharmacy")
                        : t("med.inPharmacies", { n: m.localCount })}
                    </Badge>
                  ) : (
                    <Badge tone="danger">{t("med.notInRegion")}</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="tiny dim center" style={{ padding: "4px 0" }}>
          {t("med.priceNote")}
        </p>
      </div>

      {/* ---------------- карточка препарата ---------------- */}
      <Sheet
        open={Boolean(picked)}
        onClose={() => setPicked(null)}
        title={picked ? medName(picked, lang) : ""}
        subtitle={picked ? `${pick(picked.form, lang)} · ${picked.dose}` : ""}
      >
        {picked && (
          <>
            <div className="row gap-8 wrap" style={{ marginBottom: 16 }}>
              {picked.rx ? (
                <Badge tone="warn">{t("med.rx")}</Badge>
              ) : (
                <Badge tone="ok">{t("med.otc")}</Badge>
              )}
              <Badge>{priceRange(picked, lang)}</Badge>
            </div>

            {picked.rx && (
              <div className="disclaimer" style={{ marginBottom: 16 }}>
                <MdOutlineWarningAmber />
                <span>{t("med.rxWarning")}</span>
              </div>
            )}

            <div className="medInfo">
              <div className="medInfo__row">
                <span>{t("med.ingredient")}</span>
                <b>{picked.inn}</b>
              </div>
              <div className="medInfo__row">
                <span>{t("med.form")}</span>
                <b>{pick(picked.form, lang)}</b>
              </div>
            </div>

            {picked.note && (
              <div className="medNote">
                <MdInfoOutline size={17} />
                <span>{pick(picked.note, lang)}</span>
              </div>
            )}

            <h4 className="medWhere">
              <MdPlace size={18} />
              {t("med.where")}
            </h4>

            {offers.local.length > 0 ? (
              <div className="offers">{renderOffers(offers.local)}</div>
            ) : (
              <div className="medEmpty">
                <p className="small">{t("med.notInRegion")}</p>
              </div>
            )}

            {offers.other.length > 0 && !wholeCountry && (
              <Button
                variant="soft"
                block
                icon={<MdPublic size={18} />}
                style={{ marginTop: 14 }}
                onClick={() => {
                  setWholeCountry(true);
                  haptic();
                }}
              >
                {t("med.searchCountry")}
              </Button>
            )}

            {wholeCountry && offers.other.length > 0 && (
              <>
                <h4 className="medWhere" style={{ marginTop: 20 }}>
                  <MdPublic size={18} />
                  {t("med.otherRegions")}
                </h4>
                <div className="offers">{renderOffers(offers.other)}</div>
              </>
            )}

            <div className="medActs">
              <Button
                variant="ghost"
                block
                icon={<MdAdd size={18} />}
                onClick={() => addToKit(picked)}
              >
                {t("med.addToKit")}
              </Button>
              <Button
                block
                icon={<MdOutlineForum size={18} />}
                onClick={() => askAi(picked)}
              >
                {t("med.askAi")}
              </Button>
            </div>

            <p className="tiny dim" style={{ marginTop: 14 }}>
              {t("med.priceNote")}
            </p>
          </>
        )}
      </Sheet>
    </AppShell>
  );
}
