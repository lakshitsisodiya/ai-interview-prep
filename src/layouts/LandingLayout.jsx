import { Outlet } from 'react-router-dom'
import LandingNav from '@/components/layout/LandingNav.jsx'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-void">
      <LandingNav />
      <main><Outlet /></main>
    </div>
  )
}

