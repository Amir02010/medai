import React from "react";
import { MdCheckCircle, MdErrorOutline, MdInfoOutline } from "react-icons/md";
import { useToasts } from "../../lib/toast";

const ICON = {
  ok: <MdCheckCircle color="var(--ok-500)" size={19} />,
  err: <MdErrorOutline color="var(--danger-500)" size={19} />,
  info: <MdInfoOutline color="var(--brand-500)" size={19} />,
};

export default function Toasts() {
  const items = useToasts((s) => s.items);
  if (!items.length) return null;

  return (
    <div className="toasts">
      {items.map((i) => (
        <div key={i.id} className={`toast toast--${i.tone}`}>
          {ICON[i.tone] || ICON.info}
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
}
