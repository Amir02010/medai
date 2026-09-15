import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/base.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

/* Офлайн-режим: приложение открывается без сети.
   Регистрируем только в продакшене, чтобы не мешать разработке. */
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* не критично */
    });
  });
}
