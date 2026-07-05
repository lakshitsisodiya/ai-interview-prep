import { NavLink, useNavigate } from 'react-router-dom'
import {
  HiSparkles, HiViewGrid, HiLightningBolt, HiChatAlt2,
  HiBookOpen, HiBookmark, HiClock, HiX
} from 'react-icons/hi'
import { APP_NAME } from '@/constants/index.js'
import { useApp } from '@/context/AppContext.jsx'

const NAV = [
  { path: '/dashboard',  label: 'Dashboard',         icon: HiViewGrid },
  { path: '/interview',  label: 'Generate Questions', icon: HiLightningBolt },
  { path: '/mock',       label: 'Mock Interview',     icon: HiChatAlt2 },
  { path: '/study-plan', label: 'Study Plan',         icon: HiBookOpen },
  { path: '/saved',      label: 'Saved Questions',    icon: HiBookmark },
  { path: '/history',    label: 'History',            icon: HiClock },
]

function NavContent({ onClose }) {
  const navigate = useNavigate()
  const { savedQuestions } = useApp()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-border flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center">
          <HiSparkles className="w-4 h-4 text-brand" />
        </div>
        <div>
          <p className="font-display font-bold text-ink-100 text-sm leading-none">{APP_NAME}</p>
          <p className="text-xs text-ink-600 font-mono mt-0.5">AI-powered prep</p>
        </div>
        {onClose && (
          <button className="btn-ghost btn-icon ml-auto lg:hidden" onClick={onClose}>
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-xs font-mono text-ink-600 uppercase tracking-widest px-3 pb-2">Workspace</p>
        {NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-150
              ${isActive
                ? 'bg-brand/12 text-brand-glow border border-brand/20'
                : 'text-ink-400 hover:text-ink-200 hover:bg-surface-overlay'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand' : 'text-ink-600'}`} />
                <span>{item.label}</span>
                {item.path === '/saved' && savedQuestions.length > 0 && (
                  <span className="ml-auto text-xs font-mono bg-surface-border text-ink-500 rounded-full px-1.5 py-0.5">
                    {savedQuestions.length}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom promo */}
      <div className="p-4 flex-shrink-0 border-t border-surface-border">
        <div className="border-glow rounded-2xl p-4 space-y-2">
          <p className="text-xs font-display font-semibold text-ink-200">Ready to practice?</p>
          <p className="text-xs text-ink-500 leading-relaxed">Run a mock interview to test your current level.</p>
          <button
            onClick={() => { navigate('/mock'); onClose?.() }}
            className="w-full btn-primary btn-sm mt-2"
          >
            Start mock →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-surface-border h-screen flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-surface-border flex flex-col lg:hidden animate-drawer-in">
          <NavContent onClose={onClose} />
        </aside>
      )}
    </>
  )
}
