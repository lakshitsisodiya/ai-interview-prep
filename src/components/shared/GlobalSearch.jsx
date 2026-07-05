import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiSearch, HiX, HiLightningBolt, HiBookmark, HiClock } from 'react-icons/hi'
import { useApp } from '@/context/AppContext.jsx'
import { filterByQuery, truncate } from '@/utils/index.js'

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { savedQuestions, history } = useApp()

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Global ⌘K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const savedResults = filterByQuery(savedQuestions, query, ['question', 'topic', 'category']).slice(0, 5)
  const historyResults = filterByQuery(history, query, ['company', 'role']).slice(0, 3)
  const hasResults = savedResults.length > 0 || historyResults.length > 0

  const go = (path) => { navigate(path); onClose() }

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-raised border border-surface-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border">
          <HiSearch className="w-5 h-5 text-ink-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search questions, sessions, companies..."
            className="flex-1 bg-transparent text-ink-200 text-sm placeholder:text-ink-600 focus:outline-none"
          />
          <button onClick={onClose} className="btn-ghost btn-icon">
            <HiX className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query && (
            <div className="p-4 space-y-0.5">
              <p className="text-xs text-ink-600 font-mono uppercase tracking-wide px-2 mb-2">Quick actions</p>
              {[
                { label: 'Generate new questions', path: '/interview', icon: HiLightningBolt },
                { label: 'View saved questions',   path: '/saved',     icon: HiBookmark },
                { label: 'View history',           path: '/history',   icon: HiClock },
              ].map(a => (
                <button key={a.path} onClick={() => go(a.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-overlay text-ink-300 text-sm transition-colors text-left">
                  <a.icon className="w-4 h-4 text-ink-500" />
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {query && !hasResults && (
            <div className="py-12 text-center">
              <p className="text-ink-500 text-sm">No results for "{query}"</p>
            </div>
          )}

          {savedResults.length > 0 && (
            <div className="p-4 space-y-0.5">
              <p className="text-xs text-ink-600 font-mono uppercase tracking-wide px-2 mb-2">Saved questions</p>
              {savedResults.map(q => (
                <button key={q.id} onClick={() => go('/saved')}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-overlay text-left transition-colors">
                  <HiBookmark className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                  <span className="text-ink-300 text-sm">{truncate(q.question, 80)}</span>
                </button>
              ))}
            </div>
          )}

          {historyResults.length > 0 && (
            <div className="p-4 pt-0 space-y-0.5">
              <p className="text-xs text-ink-600 font-mono uppercase tracking-wide px-2 mb-2">Past sessions</p>
              {historyResults.map(h => (
                <button key={h.id} onClick={() => go('/history')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-overlay text-left transition-colors">
                  <HiClock className="w-4 h-4 text-ink-500 flex-shrink-0" />
                  <span className="text-ink-300 text-sm">{h.company} — {h.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-surface-border bg-surface">
          <p className="text-xs text-ink-600 font-mono">
            Press <kbd className="bg-surface-overlay border border-surface-border px-1.5 py-0.5 rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}
