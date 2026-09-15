import React from "react";
import "./BodyMap.css";

/* ============================================================
   Интерактивная схема тела. Чистый SVG, без картинок.
   side: "front" | "back"
   ============================================================ */

function Zone({ id, active, onPick, children, label }) {
  return (
    <g
      className={`bm__zone ${active === id ? "bm__zone--on" : ""}`}
      onClick={() => onPick(id)}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active === id}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(id);
        }
      }}
    >
      {children}
    </g>
  );
}

export default function BodyMap({ side = "front", active, onPick, labels = {}, ariaLabel = "" }) {
  const L = (k) => labels[k] || k;

  return (
    <svg className="bm" viewBox="0 0 220 440" role="group" aria-label={ariaLabel}>
      <defs>
        <linearGradient id="bmSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bm-1)" />
          <stop offset="100%" stopColor="var(--bm-2)" />
        </linearGradient>
      </defs>

      {/* ---------- силуэт ---------- */}
      <g className="bm__body" aria-hidden="true">
        {/* голова */}
        <ellipse cx="110" cy="36" rx="23" ry="27" />
        {/* шея */}
        <path d="M101 58 L119 58 L120 76 L100 76 Z" />
        {/* торс: плечи → талия → бёдра */}
        <path
          d="M110 74
             C 130 74 142 80 148 90
             C 152 108 150 126 147 142
             C 144 162 140 182 139 200
             C 139 214 141 228 140 240
             L 80 240
             C 79 228 81 214 81 200
             C 80 182 76 162 73 142
             C 70 126 68 108 72 90
             C 78 80 90 74 110 74 Z"
        />
        {/* руки */}
        <path d="M71 92 C 60 98 55 112 53 130 L 47 178 C 46 190 44 198 43 206 L 57 208 C 59 198 61 188 62 178 L 69 134 Z" />
        <path d="M149 92 C 160 98 165 112 167 130 L 173 178 C 174 190 176 198 177 206 L 163 208 C 161 198 159 188 158 178 L 151 134 Z" />
        {/* кисти */}
        <ellipse cx="50" cy="218" rx="8.5" ry="12" />
        <ellipse cx="170" cy="218" rx="8.5" ry="12" />
        {/* ноги */}
        <path d="M82 242 L106 242 C 106 268 105 300 104 326 C 103 356 102 386 101 408 L 85 408 C 84 386 83 356 82 326 C 81 300 81 268 82 242 Z" />
        <path d="M114 242 L138 242 C 139 268 139 300 138 326 C 137 356 136 386 135 408 L 119 408 C 118 386 117 356 116 326 C 115 300 114 268 114 242 Z" />
        {/* стопы */}
        <path d="M85 406 L101 406 L103 420 L82 420 Z" />
        <path d="M119 406 L135 406 L138 420 L117 420 Z" />
      </g>

      {/* ---------- кликабельные зоны ---------- */}
      {side === "front" ? (
        <>
          <Zone id="head" active={active} onPick={onPick} label={L("head")}>
            <ellipse cx="110" cy="34" rx="24" ry="26" />
          </Zone>
          <Zone id="eyes" active={active} onPick={onPick} label={L("eyes")}>
            <rect x="86" y="21" width="48" height="27" rx="13" />
          </Zone>
          <Zone id="throat" active={active} onPick={onPick} label={L("throat")}>
            <rect x="95" y="56" width="30" height="26" rx="11" />
          </Zone>
          <Zone id="chest" active={active} onPick={onPick} label={L("chest")}>
            <path d="M74 84 Q110 74 146 84 L149 138 L71 138 Z" />
          </Zone>
          <Zone id="abdomen" active={active} onPick={onPick} label={L("abdomen")}>
            <rect x="73" y="140" width="74" height="48" rx="16" />
          </Zone>
          <Zone id="pelvis" active={active} onPick={onPick} label={L("pelvis")}>
            <path d="M76 190 L144 190 L140 240 L80 240 Z" />
          </Zone>
          <Zone id="arm" active={active} onPick={onPick} label={L("arm")}>
            <path d="M68 88 L53 96 Q46 124 44 186 L41 212 L60 214 L64 178 L71 132 Z" />
            <path d="M152 88 L167 96 Q174 124 176 186 L179 212 L160 214 L156 178 L149 132 Z" />
          </Zone>
          <Zone id="leg" active={active} onPick={onPick} label={L("leg")}>
            <path d="M80 242 L107 242 L104 420 L82 420 Z" />
            <path d="M113 242 L140 242 L138 420 L116 420 Z" />
          </Zone>
        </>
      ) : (
        <>
          <Zone id="head" active={active} onPick={onPick} label={L("head")}>
            <ellipse cx="110" cy="34" rx="24" ry="26" />
          </Zone>
          <Zone id="throat" active={active} onPick={onPick} label={L("throat")}>
            <rect x="95" y="56" width="30" height="26" rx="11" />
          </Zone>
          <Zone id="back" active={active} onPick={onPick} label={L("back")}>
            <path d="M74 84 Q110 74 146 84 L148 188 L72 188 Z" />
          </Zone>
          <Zone id="pelvis" active={active} onPick={onPick} label={L("pelvis")}>
            <path d="M74 190 L146 190 L140 240 L80 240 Z" />
          </Zone>
          <Zone id="arm" active={active} onPick={onPick} label={L("arm")}>
            <path d="M68 88 L53 96 Q46 124 44 186 L41 212 L60 214 L64 178 L71 132 Z" />
            <path d="M152 88 L167 96 Q174 124 176 186 L179 212 L160 214 L156 178 L149 132 Z" />
          </Zone>
          <Zone id="leg" active={active} onPick={onPick} label={L("leg")}>
            <path d="M80 242 L107 242 L104 420 L82 420 Z" />
            <path d="M113 242 L140 242 L138 420 L116 420 Z" />
          </Zone>
        </>
      )}
    </svg>
  );
}
