import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login/Login";
import { useStore } from "./store/useStore";
import { useTheme } from "./hooks/useTheme";
import { useTelegram } from "./hooks/useTelegram";
import { expandTelegram } from "./lib/platform";

/* Экран входа грузится сразу — он первый. Остальное подгружается
   по мере перехода, чтобы первая загрузка была лёгкой. */
const Onboarding = lazy(() => import("./pages/Onboarding/Onboarding"));
const Home = lazy(() => import("./pages/Home/Home"));
const Assistant = lazy(() => import("./pages/Assistant/Assistant"));
const Checker = lazy(() => import("./pages/Checker/Checker"));
const Medicines = lazy(() => import("./pages/Medicines/Medicines"));
const Nearby = lazy(() => import("./pages/Nearby/Nearby"));
const Doctors = lazy(() => import("./pages/Doctors/Doctors"));
const Meds = lazy(() => import("./pages/Meds/Meds"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Pro = lazy(() => import("./pages/Pro/Pro"));
const Legal = lazy(() => import("./pages/Legal/Legal"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

/** Пускает дальше только авторизованных */
function Guard({ children }) {
  const isAuthed = useStore((s) => s.isAuthed);
  const onboarded = useStore((s) => s.onboarded);
  const location = useLocation();

  if (!isAuthed) return <Navigate to="/" replace />;
  if (!onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

/** Прокрутка наверх при смене страницы */
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Заглушка на время подгрузки страницы */
function Loading() {
  return (
    <div
      style={{
        minHeight: "60dvh",
        display: "grid",
        placeItems: "center",
        color: "var(--text-3)",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          border: "2.5px solid currentColor",
          borderRightColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}

export default function App() {
  useTheme();
  const { initUser } = useTelegram();

  useEffect(() => {
    expandTelegram();
    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <ScrollTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/legal/:doc" element={<Legal />} />

          <Route path="/home" element={<Guard><Home /></Guard>} />
          <Route path="/assistant" element={<Guard><Assistant /></Guard>} />
          <Route path="/checker" element={<Guard><Checker /></Guard>} />
          <Route path="/medicines" element={<Guard><Medicines /></Guard>} />
          <Route path="/nearby" element={<Guard><Nearby /></Guard>} />
          <Route path="/pharmacies" element={<Navigate to="/nearby" replace />} />
          <Route path="/doctors" element={<Guard><Doctors /></Guard>} />
          <Route path="/meds" element={<Guard><Meds /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/pro" element={<Guard><Pro /></Guard>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
