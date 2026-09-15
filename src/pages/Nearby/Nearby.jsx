import React, { useMemo, useState } from "react";
import {
  MdSearch,
  MdOutlineLocalPharmacy,
  MdMyLocation,
  MdDirections,
  MdCall,
  MdStar,
  MdLocalHospital,
} from "react-icons/md";

import AppShell from "../../components/Layout/AppShell";
import RegionPicker from "../../components/RegionPicker";
import { Card, Button, Input, Chip, Badge, Empty, Segmented } from "../../components/UI";
import { useI18n, pick } from "../../i18n";
import { useStore } from "../../store/useStore";
import { PHARMACIES, HOSPITALS, HOSPITAL_TYPES } from "../../data/catalog";
import { regionById } from "../../data/regions";
import { useGeo, distanceKm } from "../../hooks/useGeo";
import { haptic, openLink, call } from "../../lib/platform";
import { EMERGENCY_NUMBER } from "../../lib/redFlags";
import { useTelegramBack } from "../../hooks/useTelegram";
import "./Nearby.css";

export default function Nearby() {
  const { t, lang } = useI18n();
  useTelegramBack("/home");

  const region = useStore((s) => s.region);
  const { location, status, request } = useGeo();

  const [tab, setTab] = useState("pharmacies");
  const [q, setQ] = useState("");
  const [only24, setOnly24] = useState(false);
  const [hospType, setHospType] = useState("all");

  const nowHour = new Date().getHours();
  const isOpen = (p) => p.open24 || (p.hours && nowHour >= p.hours[0] && nowHour < p.hours[1]);

  const withGeo = (arr) =>
    arr
      .map((p) => ({
        ...p,
        km: location ? distanceKm(location, { lat: p.lat, lng: p.lng }) : null,
      }))
      .sort((a, b) => {
        if (a.km != null && b.km != null) return a.km - b.km;
        return (b.rating || 0) - (a.rating || 0);
      });

  /* ---------------- аптеки ---------------- */
  const pharmacies = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = PHARMACIES.filter((p) => !region || p.region === region);
    if (needle) {
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          pick(p.address, lang).toLowerCase().includes(needle)
      );
    }
    if (only24) out = out.filter((p) => p.open24);
    return withGeo(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, only24, region, location, lang]);

  /* ---------------- больницы ---------------- */
  const hospitals = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = HOSPITALS.filter((h) => !region || h.region === region);
    if (hospType !== "all") out = out.filter((h) => h.type === hospType);
    if (needle) {
      out = out.filter(
        (h) =>
          pick(h.name, lang).toLowerCase().includes(needle) ||
          pick(h.address, lang).toLowerCase().includes(needle)
      );
    }
    return withGeo(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, hospType, region, location, lang]);

  const usedHospTypes = useMemo(() => {
    const ids = new Set(
      HOSPITALS.filter((h) => !region || h.region === region).map((h) => h.type)
    );
    return HOSPITAL_TYPES.filter((x) => ids.has(x.id));
  }, [region]);

  const route = (p) => {
    haptic();
    openLink(
      `https://yandex.uz/maps/?rtext=${location ? `${location.lat},${location.lng}~` : ""}${p.lat},${p.lng}&rtt=auto`
    );
  };

  const geoChip = (
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
  );

  return (
    <AppShell title={t("near.title")} action={<RegionPicker compact />}>
      <div className="near">
        <div className="near__tools">
          <Segmented
            label={t("near.title")}
            value={tab}
            onChange={(v) => {
              setTab(v);
              setQ("");
              haptic();
            }}
            items={[
              { value: "pharmacies", label: t("near.pharmacies") },
              { value: "hospitals", label: t("near.hospitals") },
            ]}
          />

          <Input
            icon={<MdSearch />}
            placeholder={tab === "pharmacies" ? t("ph.search") : t("near.hospSub")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t("common.search")}
          />

          <div className="near__filters">
            {tab === "pharmacies" ? (
              <>
                <Chip on={only24} onClick={() => { setOnly24((v) => !v); haptic(); }}>
                  {t("ph.open24")}
                </Chip>
                {geoChip}
              </>
            ) : (
              <>
                <Chip on={hospType === "all"} onClick={() => { setHospType("all"); haptic(); }}>
                  {t("near.allTypes")}
                </Chip>
                {usedHospTypes.map((x) => (
                  <Chip
                    key={x.id}
                    on={hospType === x.id}
                    onClick={() => { setHospType(x.id); haptic(); }}
                  >
                    <span>{x.icon}</span>
                    {pick(x, lang)}
                  </Chip>
                ))}
                {geoChip}
              </>
            )}
            {status === "denied" && <span className="tiny dim">{t("ph.geoDenied")}</span>}
          </div>
        </div>

        {/* ---------------- аптеки ---------------- */}
        {tab === "pharmacies" &&
          (pharmacies.length === 0 ? (
            <Card>
              <Empty icon={<MdOutlineLocalPharmacy />} title={t("ph.none")} />
            </Card>
          ) : (
            <div className="near__grid">
              {pharmacies.map((p, i) => (
                <Card key={p.id} hover className={`nearCard anim-up d${Math.min(i + 1, 6)}`}>
                  <div className="nearCard__top">
                    <div className="iconbox iconbox--mint iconbox--lg">
                      <MdOutlineLocalPharmacy />
                    </div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <h3>{p.name}</h3>
                      <p className="small">{pick(p.address, lang)}</p>
                    </div>
                    {p.km != null && (
                      <div className="nearCard__km">
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
                        {p.hours
                          ? ` · ${String(p.hours[0]).padStart(2, "0")}:00–${p.hours[1]}:00`
                          : ""}
                      </Badge>
                    )}
                    <Badge tone="warn">
                      <MdStar size={12} /> {p.rating}
                    </Badge>
                    {!region && (
                      <Badge>{pick(regionById(p.region), lang)}</Badge>
                    )}
                  </div>

                  <div className="nearCard__acts">
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
          ))}

        {/* ---------------- больницы ---------------- */}
        {tab === "hospitals" && (
          <>
            <div className="near__sos">
              <div className="iconbox iconbox--danger iconbox--lg">
                <MdLocalHospital />
              </div>
              <div className="grow">
                <h4>{t("home.emergency")}</h4>
                <p className="tiny">{t("home.emergencySub")}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<MdCall size={17} />}
                onClick={() => {
                  haptic("warning");
                  call(EMERGENCY_NUMBER);
                }}
              >
                103
              </Button>
            </div>

            {hospitals.length === 0 ? (
              <Card>
                <Empty icon={<MdLocalHospital />} title={t("ph.none")} />
              </Card>
            ) : (
              <div className="near__grid">
                {hospitals.map((h, i) => {
                  const type = HOSPITAL_TYPES.find((x) => x.id === h.type);
                  return (
                    <Card key={h.id} hover className={`nearCard anim-up d${Math.min(i + 1, 6)}`}>
                      <div className="nearCard__top">
                        <div className="nearCard__emoji">{type?.icon}</div>
                        <div className="grow" style={{ minWidth: 0 }}>
                          <h3>{pick(h.name, lang)}</h3>
                          <p className="small">{pick(h.address, lang)}</p>
                        </div>
                        {h.km != null && (
                          <div className="nearCard__km">
                            {h.km.toFixed(1)}
                            <span>{t("common.km")}</span>
                          </div>
                        )}
                      </div>

                      <div className="row gap-8 wrap" style={{ marginTop: 14 }}>
                        <Badge tone="brand">{pick(type, lang)}</Badge>
                        {h.open24 ? (
                          <Badge tone="ok">{t("ph.open24")}</Badge>
                        ) : (
                          <Badge tone={isOpen(h) ? "ok" : "danger"}>
                            {isOpen(h) ? t("ph.openNow") : t("ph.closed")}
                            {h.hours
                              ? ` · ${String(h.hours[0]).padStart(2, "0")}:00–${h.hours[1]}:00`
                              : ""}
                          </Badge>
                        )}
                        {!region && <Badge>{pick(regionById(h.region), lang)}</Badge>}
                      </div>

                      <div className="nearCard__acts">
                        <Button size="sm" icon={<MdDirections size={17} />} onClick={() => route(h)}>
                          {t("ph.route")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<MdCall size={17} />}
                          onClick={() => call(h.phone)}
                        >
                          {t("ph.call")}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
