import React from "react";

/* ============================================================
   Страховка от белого экрана.
   Если что-то упало — показываем понятный экран и даём выход,
   а не пустую страницу.
   ============================================================ */

const TEXT = {
  uz: {
    title: "Nimadir noto'g'ri ketdi",
    sub: "Sahifani yangilab ko'ring. Ma'lumotlaringiz saqlanib qoladi.",
    reload: "Yangilash",
    home: "Asosiyga",
  },
  ru: {
    title: "Что-то пошло не так",
    sub: "Попробуйте обновить страницу — ваши данные сохранены.",
    reload: "Обновить",
    home: "На главную",
  },
  en: {
    title: "Something went wrong",
    sub: "Try reloading the page — your data is safe.",
    reload: "Reload",
    home: "Go home",
  },
};

function currentLang() {
  try {
    const raw = localStorage.getItem("medai-store-v1");
    return (raw && JSON.parse(raw).state?.lang) || "ru";
  } catch {
    return "ru";
  }
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[MedAI] render error", error, info?.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const t = TEXT[currentLang()] || TEXT.ru;

    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          textAlign: "center",
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          color: "var(--text, #12203a)",
        }}
      >
        <div style={{ maxWidth: 380 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 20,
              margin: "0 auto 18px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #5a97fb, #1b62d6)",
              color: "#fff",
              fontSize: 30,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>{t.title}</h1>
          <p style={{ fontSize: 14.5, color: "var(--text-2, #55688a)", marginBottom: 22 }}>
            {t.sub}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                height: 46,
                padding: "0 22px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #2d7df6, #1b62d6)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {t.reload}
            </button>
            <button
              onClick={() => {
                window.location.href = "/home";
              }}
              style={{
                height: 46,
                padding: "0 22px",
                borderRadius: 14,
                border: "1px solid var(--line, #e4ecf8)",
                background: "var(--surface, #fff)",
                color: "inherit",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {t.home}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
