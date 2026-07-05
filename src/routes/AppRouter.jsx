import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout.jsx'
import LandingLayout from '@/layouts/LandingLayout.jsx'

const LandingPage    = lazy(() => import('@/pages/LandingPage.jsx'))
const DashboardPage  = lazy(() => import('@/pages/DashboardPage.jsx'))
const InterviewPage  = lazy(() => import('@/pages/InterviewPage.jsx'))
const MockPage       = lazy(() => import('@/pages/MockPage.jsx'))
// const StudyPlanPage  = lazy(() => import('@/pages/StudyPlanPage.jsx'))
// const SavedPage      = lazy(() => import('@/pages/SavedPage.jsx'))
// const HistoryPage    = lazy(() => import('@/pages/HistoryPage.jsx'))
// const NotFoundPage   = lazy(() => import('@/pages/NotFoundPage.jsx'))

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex gap-2">
        <span className="w-2 h-2 rounded-full bg-brand animate-dot-1 inline-block" />
        <span className="w-2 h-2 rounded-full bg-brand animate-dot-2 inline-block" />
        <span className="w-2 h-2 rounded-full bg-brand animate-dot-3 inline-block" />
      </div>
    </div>
  )
}

function Wrap({ children }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Wrap><LandingPage /></Wrap>} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard"  element={<Wrap><DashboardPage /></Wrap>} />
        <Route path="/interview"  element={<Wrap><InterviewPage /></Wrap>} />
        <Route path="/mock"       element={<Wrap><MockPage /></Wrap>} />
        {/* <Route path="/study-plan" element={<Wrap><StudyPlanPage /></Wrap>} />
        <Route path="/saved"      element={<Wrap><SavedPage /></Wrap>} />
        <Route path="/history"    element={<Wrap><HistoryPage /></Wrap>} /> */}
      </Route>

      {/* <Route path="/404" element={<Wrap><NotFoundPage /></Wrap>} />
      <Route path="*"    element={<Navigate to="/404" replace />} /> */}
    </Routes>
  )
}