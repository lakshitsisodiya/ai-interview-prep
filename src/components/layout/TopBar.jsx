import { useLocation } from 'react-router-dom'
import { HiMenu, HiSearch, HiSun, HiMoon } from 'react-icons/hi'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useApp } from '@/context/AppContext.jsx'

const LABELS = {
  '/dashboard': 'Dashboard',
  '/interview': 'Generate Questions',
  '/mock': 'Mock Interview',
  '/study-plan': 'Study Plan',
  '/saved': 'Saved Questions',
  '/history': 'History',
}

export default function TopBar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme()
  const { setSearchOpen } = useApp()
  const { pathname } = useLocation()

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-surface-border bg-surface/80 backdrop-blur-md flex-shrink-0">
      <div className="flex items-center gap-3">
        <button className="btn-ghost btn-icon lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <HiMenu className="w-5 h-5" />
        </button>
        <h1 className="font-display font-semibold text-ink-200 text-sm">{LABELS[pathname] || ''}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-overlay border border-surface-border
                     text-ink-500 text-xs font-mono hover:border-brand/30 hover:text-ink-300 transition-all"
        >
          <HiSearch className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-2xs opacity-60 bg-surface-border px-1 rounded">⌘K</kbd>
        </button>
        <button onClick={toggleTheme} className="btn-ghost btn-icon" aria-label="Toggle theme">
          {isDark
            ? <HiSun className="w-4 h-4 text-warn" />
            : <HiMoon className="w-4 h-4 text-brand-glow" />
          }
        </button>
      </div>
    </header>
  )
}