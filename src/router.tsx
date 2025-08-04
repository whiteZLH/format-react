import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("./pages/Home"));
const Format = lazy(() => import("./pages/Format"));

const AppRouter = () => {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/format" element={<Format />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
