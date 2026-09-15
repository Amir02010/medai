import React, { useState } from "react";
import { MdPlace, MdMyLocation, MdExpandMore } from "react-icons/md";

import { Sheet, Button, Chip } from "./UI";
import { useI18n, pick } from "../i18n";
import { useStore } from "../store/useStore";
import { REGIONS, regionById, nearestRegion } from "../data/regions";
import { useGeo } from "../hooks/useGeo";
import { haptic } from "../lib/platform";
import "./RegionPicker.css";

/**
 * Кнопка «мой регион» + шторка выбора.
 * Регион запоминается, чтобы человек не выбирал его каждый раз.
 */
export default function RegionPicker({ compact }) {
  const { t, lang } = useI18n();
  const region = useStore((s) => s.region);
  const setRegion = useStore((s) => s.setRegion);
  const { location, request } = useGeo();

  const [open, setOpen] = useState(false);
  const current = regionById(region);

  const detect = () => {
    haptic();
    if (location) {
      const r = nearestRegion(location);
      if (r) {
        setRegion(r.id);
        setOpen(false);
      }
      return;
    }
    request();
  };

  return (
    <>
      <button
        className={`regionBtn ${compact ? "regionBtn--compact" : ""}`}
        onClick={() => {
          setOpen(true);
          haptic();
        }}
        aria-label={t("region.pick")}
      >
        <MdPlace size={17} />
        <span>{current ? pick(current, lang) : t("region.pick")}</span>
        <MdExpandMore size={17} />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("region.pick")}
        subtitle={t("region.sub")}
      >
        <Button
          variant="ghost"
          block
          icon={<MdMyLocation size={18} />}
          onClick={detect}
          style={{ marginBottom: 16 }}
        >
          {t("region.detect")}
        </Button>

        <div className="regionList">
          {REGIONS.map((r) => (
            <Chip
              key={r.id}
              on={region === r.id}
              onClick={() => {
                setRegion(r.id);
                setOpen(false);
                haptic("success");
              }}
            >
              {pick(r, lang)}
            </Chip>
          ))}
        </div>
      </Sheet>
    </>
  );
}
