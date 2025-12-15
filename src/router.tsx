import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

const UniversalFormatter = lazy(() => import("./pages/UniversalFormatter"));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/format/json" replace />} />
          <Route path="/format/:lang" element={<UniversalFormatter />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
