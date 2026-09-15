import React, { useMemo, useState } from "react";
import {
  MdSearch,
  MdOutlineLocalPharmacy,
  MdMyLocation,
  MdDirections,
  MdCall,
  MdStar,
  MdOutlineInventory2,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import { Card, Button, Input, Chip, Badge, Empty } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { PHARMACIES } from "../../data/catalog";
import { useGeo, distanceKm } from "../../hooks/useGeo";
import { haptic, openLink, call } from "../../lib/platform";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Pharmacies.css";

export default function Pharmacies() {
  const { t, lang } = useI18n();
  useTelegramBack("/home");

  const { location, status, request } = useGeo();
  const [q, setQ] = useState("");
  const [only24, setOnly24] = useState(false);

  const nowHour = new Date().getHours();

  const isOpen = (p) => p.open24 || (p.hours && nowHour >= p.hours[0] && nowHour < p.hours[1]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();

    let out = PHARMACIES.map((p) => ({
      ...p,
      km: location ? distanceKm(location, { lat: p.lat, lng: p.lng }) : null,
      matchedDrug: needle ? p.stock.find((s) => s.includes(needle)) : null,
    }));

    if (needle) {
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          pick(p.address, lang).toLowerCase().includes(needle) ||
          p.matchedDrug
      );
    }
    if (only24) out = out.filter((p) => p.open24);

    out.sort((a, b) => {
      if (a.km != null && b.km != null) return a.km - b.km;
      return b.rating - a.rating;
    });
    return out;
  }, [q, only24, location, lang]);

  const route = (p) => {
    haptic();
    openLink(`https://yandex.uz/maps/?rtext=${location ? `${location.lat},${location.lng}~` : ""}${p.lat},${p.lng}&rtt=auto`);
  };

  return (
    <AppShell title={t("ph.title")}>
      <div className="phs">
        <div className="phs__tools">
          <Input
            icon={<MdSearch />}
            placeholder={t("ph.search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="row gap-8 wrap" style={{ marginTop: 12 }}>
            <Chip on={only24} onClick={() => { setOnly24((v) => !v); haptic(); }}>
              {t("ph.open24")}
            </Chip>
            <Chip
              on={status === "ok"}
              onClick={() => {
                haptic();
                request();
              }}
            >
              <MdMyLocation size={15} />
              {status === "asking" ? t("common.loading") : t("ph.geo")}
            </Chip>
            {status === "denied" && <span className="tiny dim">{t("ph.geoDenied")}</span>}
          </div>
        </div>

        {list.length === 0 ? (
          <Card>
            <Empty icon={<MdOutlineLocalPharmacy />} title={t("ph.none")} />
          </Card>
        ) : (
          <div className="phs__grid">
            {list.map((p, i) => (
              <Card key={p.id} hover className={`ph anim-up d${Math.min(i + 1, 6)}`}>
                <div className="ph__top">
                  <div className="iconbox iconbox--mint iconbox--lg">
                    <MdOutlineLocalPharmacy />
                  </div>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <h3>{p.name}</h3>
                    <p className="small">{pick(p.address, lang)}</p>
                  </div>
                  {p.km != null && (
                    <div className="ph__km">
                      {p.km.toFixed(1)}
                      <span>{t("common.km")}</span>
                    </div>
                  )}
                </div>

                <div className="row gap-8 wrap" style={{ marginTop: 14 }}>
                  {p.open24 ? (
                    <Badge tone="ok">{t("ph.open24")}</Badge>
                  ) : (
                    <Badge tone={isOpen(p) ? "ok" : "danger"}>
                      {isOpen(p) ? t("ph.openNow") : t("ph.closed")}
                      {p.hours ? ` · ${String(p.hours[0]).padStart(2, "0")}:00–${p.hours[1]}:00` : ""}
                    </Badge>
                  )}
                  <Badge tone="warn">
                    <MdStar size={12} /> {p.rating}
                  </Badge>
                  {p.matchedDrug && (
                    <Badge tone="brand">
                      <MdOutlineInventory2 size={12} /> {t("ph.inStock")}: {p.matchedDrug}
                    </Badge>
                  )}
                </div>

                <div className="ph__actions">
                  <Button size="sm" icon={<MdDirections size={17} />} onClick={() => route(p)}>
                    {t("ph.route")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<MdCall size={17} />}
                    onClick={() => call(p.phone)}
                  >
                    {t("ph.call")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
