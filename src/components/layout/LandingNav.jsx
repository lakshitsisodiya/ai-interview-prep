import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiSparkles, HiMenu, HiX } from 'react-icons/hi'
import { APP_NAME } from '@/constants/index.js'

export default function LandingNav() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center">
            <HiSparkles className="w-3.5 h-3.5 text-brand" />
          </div>
          <span className="font-display font-bold text-ink-100 text-sm">{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-400">
          <a href="#features" className="hover:text-ink-200 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink-200 transition-colors">How it works</a>
          <a href="#companies" className="hover:text-ink-200 transition-colors">Companies</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary btn-sm">Sign in</button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary btn-sm">Start free →</button>
        </div>

        <button className="btn-ghost btn-icon md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-void/95 px-6 py-4 space-y-3 animate-slide-down">
          <a href="#features" className="block text-ink-300 text-sm py-1" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-ink-300 text-sm py-1" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#companies" className="block text-ink-300 text-sm py-1" onClick={() => setMobileOpen(false)}>Companies</a>
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary btn-sm flex-1">Sign in</button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary btn-sm flex-1">Start free →</button>
          </div>
        </div>
      )}
    </header>
  )
}
