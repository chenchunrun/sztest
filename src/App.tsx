import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';

const SchoolDetail = lazy(() => import('@/pages/SchoolDetail'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const AdmissionPlans2026Page = lazy(() => import('@/pages/AdmissionPlans2026Page'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteFallback({ message }: { message: string }) {
  return <div className="min-h-screen bg-slate-50 pt-24 text-center text-sm text-slate-500">{message}</div>;
}

function LazyRoute({ children, message }: { children: ReactNode; message: string }) {
  return <Suspense fallback={<RouteFallback message={message} />}>{children}</Suspense>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/school/:id"
        element={(
          <LazyRoute message="正在加载学校详情...">
            <SchoolDetail />
          </LazyRoute>
        )}
      />
      <Route
        path="/compare"
        element={(
          <LazyRoute message="正在加载学校对比...">
            <ComparePage />
          </LazyRoute>
        )}
      />
      <Route
        path="/admission-plans-2026"
        element={(
          <LazyRoute message="正在加载 2026 计划数据库...">
            <AdmissionPlans2026Page />
          </LazyRoute>
        )}
      />
      <Route
        path="*"
        element={(
          <LazyRoute message="正在加载页面...">
            <NotFound />
          </LazyRoute>
        )}
      />
    </Routes>
  );
}

export default App;
