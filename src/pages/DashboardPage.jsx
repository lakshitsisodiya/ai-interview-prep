import { useNavigate } from 'react-router-dom'
import { HiLightningBolt, HiChatAlt2, HiBookOpen, HiBookmark, HiTrendingUp, HiClock } from 'react-icons/hi'
import { useApp } from '@/context/AppContext.jsx'
import { formatRelative, scoreColor } from '@/utils/index.js'

function StatCard({ label, value, sub, icon: Icon, accent }) {
  const styles = {
    brand:   { wrap: 'bg-brand/10 border-brand/20',   icon: 'text-brand',   val: 'text-brand-glow' },
    success: { wrap: 'bg-success/10 border-success/20', icon: 'text-success', val: 'text-success' },
    warn:    { wrap: 'bg-warn/10 border-warn/20',      icon: 'text-warn',    val: 'text-warn' },
    ghost:   { wrap: 'bg-surface-overlay border-surface-border', icon: 'text-ink-400', val: 'text-ink-200' },
  }
  const s = styles[accent] || styles.ghost
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <p className="text-ink-500 text-xs font-mono uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${s.wrap}`}>
          <Icon className={`w-4 h-4 ${s.icon}`} />
        </div>
      </div>
      <div className={`font-display font-extrabold text-3xl mb-1 ${s.val}`}>{value}</div>
      {sub && <p className="text-ink-600 text-xs font-mono">{sub}</p>}
    </div>
  )
}

function QuickAction({ icon: Icon, label, description, path, navigate }) {
  return (
    <button onClick={() => navigate(path)} className="card card-hover p-5 text-left group w-full">
      <Icon className="w-6 h-6 text-ink-500 mb-3 group-hover:text-brand transition-colors" />
      <p className="font-display font-semibold text-ink-200 text-sm mb-1">{label}</p>
      <p className="text-ink-500 text-xs leading-relaxed">{description}</p>
      <span className="inline-block text-ink-600 text-xs mt-3 group-hover:translate-x-1 transition-transform">→</span>
    </button>
  )
}

const TYPE_ICONS = { mock: HiChatAlt2, 'study-plan': HiBookOpen, questions: HiLightningBolt }
const TYPE_COLORS = { mock: 'text-success', 'study-plan': 'text-warn', questions: 'text-brand' }

export default function DashboardPage() {
  const navigate = useNavigate()
  const { getStats, history, mockSessions, savedQuestions } = useApp()
  const stats = getStats()

  const recent = [...history, ...mockSessions]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 6)

  return (
    <div className="page-wrap space-y-8">
      {/* Welcome */}
      <div className="animate-fade-in">
        <h2 className="section-title">Good to see you 👋</h2>
        <p className="section-sub">
          {stats.totalSessions === 0
            ? "You haven't started preparing yet. Let's change that."
            : `${stats.totalSessions} session${stats.totalSessions !== 1 ? 's' : ''} completed. Keep going.`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sessions"   value={stats.totalSessions}                              icon={HiLightningBolt} accent="brand"   />
        <StatCard label="Mock Interviews"  value={stats.mockCompleted}                              icon={HiChatAlt2}      accent="success" />
        <StatCard label="Avg Score"        value={stats.avgScore ? `${stats.avgScore}/10` : '—'}    icon={HiTrendingUp}    accent="warn"    sub={stats.avgScore ? 'across all mocks' : 'complete a mock first'} />
        <StatCard label="Saved Questions"  value={stats.totalSaved}                                 icon={HiBookmark}      accent="ghost"   />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display font-semibold text-ink-400 text-xs uppercase tracking-widest mb-4">Quick actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <QuickAction icon={HiLightningBolt} label="Generate questions" description="Pick a company and role. Get real interview questions in seconds." path="/interview" navigate={navigate} />
          <QuickAction icon={HiChatAlt2}      label="Start mock interview" description="Practice answering and receive instant AI feedback on every answer." path="/mock" navigate={navigate} />
          <QuickAction icon={HiBookOpen}      label="Build study plan" description="Get a day-by-day roadmap tailored to your target company." path="/study-plan" navigate={navigate} />
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="font-display font-semibold text-ink-400 text-xs uppercase tracking-widest mb-4">Recent activity</h3>
        {recent.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-ink-600 text-sm">No activity yet — start a session above.</p>
          </div>
        ) : (
          <div className="card divide-y divide-surface-border overflow-hidden">
            {recent.map(item => {
              const type = item.type || 'questions'
              const Icon = TYPE_ICONS[type] || HiLightningBolt
              const cls = TYPE_COLORS[type] || 'text-brand'
              return (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-overlay/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-overlay border border-surface-border flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${cls}`} />
                    </div>
                    <div>
                      <p className="text-ink-200 text-sm font-medium">{item.company} — {item.role}</p>
                      <p className="text-ink-600 text-xs font-mono capitalize">{type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.avgScore && (
                      <span className={`text-xs font-mono font-bold text-${scoreColor(parseFloat(item.avgScore))}`}>
                        {item.avgScore}/10
                      </span>
                    )}
                    <span className="text-ink-600 text-xs font-mono flex items-center gap-1">
                      <HiClock className="w-3 h-3" />
                      {item.createdAt ? formatRelative(item.createdAt) : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Saved questions preview */}
      {savedQuestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-ink-400 text-xs uppercase tracking-widest">Saved questions</h3>
            <button onClick={() => navigate('/saved')} className="text-brand text-xs font-mono hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {savedQuestions.slice(0, 3).map(q => (
              <div key={q.id} className="card px-5 py-3.5 flex items-center justify-between gap-4">
                <p className="text-ink-300 text-sm leading-relaxed truncate flex-1">{q.question}</p>
                {q.difficulty && (
                  <span className={`badge badge-${q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'warn' : 'success'} flex-shrink-0`}>
                    {q.difficulty}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}