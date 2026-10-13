import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const QuotesPage = lazy(() => import("./pages/quotes"));
const QuoteBuilderPage = lazy(() => import("./pages/quoteBuilder"));
const CatalogPage = lazy(() => import("./pages/catalog"));
const ApprovalsPage = lazy(() => import("./pages/approvals"));
const NotFoundPage = lazy(() => import("./pages/notFound"));

const AppRoutes = (props) => {
  const location = useLocation();
  return <Suspense fallback={<Loading />}><Routes key={location.pathname}>
    <Route path="/" element={<Navigate to="/quotes" replace />} />
    <Route path="/quotes" element={<QuotesPage {...props} />} />
    <Route path="/quotes/:quoteId" element={<QuoteBuilderPage {...props} />} />
    <Route path="/catalog" element={<CatalogPage {...props} />} />
    <Route path="/approvals" element={<ApprovalsPage {...props} />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>;
};
export default AppRoutes;
