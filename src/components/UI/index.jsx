import React, { useEffect } from "react";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import "./ui.css";

/* ------------------------------ Button ------------------------------ */
export function Button({
  variant = "primary",
  size,
  block,
  icon,
  iconRight,
  loading,
  children,
  className = "",
  ...rest
}) {
  const cls = [
    "btn",
    `btn--${variant}`,
    size ? `btn--${size}` : "",
    block ? "btn--block" : "",
    !children ? "btn--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} {...rest} disabled={rest.disabled || loading}>
      {loading ? <span className="btn__spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

/* ------------------------------- Card ------------------------------- */
export function Card({ hover, glass, flat, pad, className = "", children, ...rest }) {
  const cls = [
    "card",
    hover ? "card--hover" : "",
    glass ? "card--glass" : "",
    flat ? "card--flat" : "",
    pad ? `card--pad-${pad}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export function CardHead({ title, icon, action }) {
  return (
    <div className="card__head">
      <div className="card__title">
        {icon}
        {title}
      </div>
      {action}
    </div>
  );
}

export function Section({ title, action }) {
  return (
    <div className="sect">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

/* ------------------------------ Input ------------------------------- */
export function Field({ label, hint, error, icon, action, children }) {
  return (
    <label className="field">
      {label && <span className="field__label">{label}</span>}
      <div className={`inputWrap ${icon ? "inputWrap--icon" : ""}`}>
        {icon && <span className="inputWrap__icon">{icon}</span>}
        {children}
        {action}
      </div>
      {error ? (
        <span className="field__err">{error}</span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ label, hint, error, icon, action, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error} icon={icon} action={action}>
      <input {...rest} />
    </Field>
  );
}

export function Textarea({ label, hint, error, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea {...rest} />
    </Field>
  );
}

export function Select({ label, hint, icon, options = [], ...rest }) {
  return (
    <Field
      label={label}
      hint={hint}
      icon={icon}
      action={<MdKeyboardArrowDown className="inputWrap__chev" />}
    >
      <select {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/* ------------------------------- Chip -------------------------------- */
export function Chip({ on, children, ...rest }) {
  return (
    <button type="button" className={`chip ${on ? "chip--on" : ""}`} {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------ Badge -------------------------------- */
export function Badge({ tone = "", children }) {
  return <span className={`badge ${tone ? `badge--${tone}` : ""}`}>{children}</span>;
}

/* ----------------------------- IconBox ------------------------------- */
export function IconBox({ tone = "", lg, children }) {
  return (
    <div className={`iconbox ${tone ? `iconbox--${tone}` : ""} ${lg ? "iconbox--lg" : ""}`}>
      {children}
    </div>
  );
}

/* ----------------------------- Avatar -------------------------------- */
export function Avatar({ name = "", src, size = 44 }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials || "?"}
    </div>
  );
}

/* ------------------------------ Sheet -------------------------------- */
export function Sheet({ open, onClose, title, subtitle, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet__scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="sheet__grab" />
        <div className="sheet__head">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p className="small" style={{ marginTop: 4 }}>{subtitle}</p>}
          </div>
          <Button variant="plain" onClick={onClose} aria-label="close" icon={<MdClose size={22} />} />
        </div>
        {children}
        {footer && <div style={{ marginTop: 20 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------------------- Skeleton ------------------------------- */
export function Skeleton({ h = 16, w = "100%", r, style }) {
  return <div className="skel" style={{ height: h, width: w, borderRadius: r, ...style }} />;
}

/* --------------------------- Empty state ----------------------------- */
export function Empty({ icon, title, text, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty__icon">{icon}</div>}
      <h3>{title}</h3>
      {text && <p className="small" style={{ maxWidth: 380 }}>{text}</p>}
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </div>
  );
}

/* ------------------------------ Switch ------------------------------- */
export function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      className="row gap-12"
      style={{ width: "100%", justifyContent: "space-between" }}
      onClick={() => onChange?.(!on)}
      aria-pressed={on}
    >
      {label && <span style={{ fontWeight: 600, fontSize: 14.5 }}>{label}</span>}
      <span className={`switch ${on ? "switch--on" : ""}`} />
    </button>
  );
}

/* ---------------------------- Segmented ------------------------------ */
export function Segmented({ value, onChange, items = [], label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          data-on={value === it.value}
          aria-pressed={value === it.value}
          aria-label={it.title || (typeof it.label === "string" ? undefined : it.value)}
          title={it.title}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------- Progress ------------------------------- */
export function Progress({ value = 0 }) {
  return (
    <div className="prog">
      <div className="prog__bar" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ---------------------------- Divider -------------------------------- */
export function Divider({ children }) {
  return <div className="divider">{children}</div>;
}
