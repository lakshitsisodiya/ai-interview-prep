import { useState } from 'react'
import {
  HiLightningBolt, HiBookmark, HiDuplicate, HiSparkles,
  HiChip, HiUsers, HiAcademicCap, HiOfficeBuilding, HiRefresh,
  HiChevronDown, HiChevronUp
} from 'react-icons/hi'
import { useApp } from '@/context/AppContext.jsx'
import { useInterview } from '@/context/InterviewContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { generateQuestions, generateAnswer } from '@/services/gemini.js'
import { COMPANIES, ROLES, EXPERIENCE_LEVELS, INTERVIEW_TYPES } from '@/constants/index.js'
import { copyToClipboard, diffColor, uid } from '@/utils/index.js'
import { SkeletonQuestions } from '@/components/ui/Skeletons.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'

// ── Config form ───────────────────────────────────────────────────────────────
function InterviewForm({ onGenerate, loading }) {
  const [company, setCompany] = useState('Google')
  const [customCompany, setCustomCompany] = useState('')
  const [role, setRole] = useState('Frontend Developer')
  const [customRole, setCustomRole] = useState('')
  const [experience, setExperience] = useState('Fresher')
  const [interviewType, setInterviewType] = useState('Mixed')

  const submit = () => {
    const co = company === 'Custom' ? customCompany.trim() : company
    const ro = role === 'Custom' ? customRole.trim() : role
    if (!co || !ro) return
    onGenerate({ company: co, role: ro, experience, interviewType })
  }

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
        <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/30 flex items-center justify-center">
          <HiSparkles className="w-3.5 h-3.5 text-brand" />
        </div>
        <div>
          <p className="font-display font-semibold text-ink-100 text-sm">Configure session</p>
          <p className="text-ink-600 text-xs font-mono">Fill in the details below</p>
        </div>
      </div>

      <div className="form-group">
        <label className="label">Target company</label>
        <select value={company} onChange={e => setCompany(e.target.value)} className="select">
          {COMPANIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>
        {company === 'Custom' && (
          <input type="text" value={customCompany} onChange={e => setCustomCompany(e.target.value)}
            placeholder="Enter company name..." className="input mt-2" />
        )}
      </div>

      <div className="form-group">
        <label className="label">Job role</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="select">
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
        </select>
        {role === 'Custom' && (
          <input type="text" value={customRole} onChange={e => setCustomRole(e.target.value)}
            placeholder="Enter job role..." className="input mt-2" />
        )}
      </div>

      <div className="form-group">
        <label className="label">Experience level</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_LEVELS.map(lvl => (
            <button key={lvl.value} onClick={() => setExperience(lvl.value)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-display font-medium text-left transition-all
                ${experience === lvl.value
                  ? 'bg-brand/12 border-brand/40 text-brand-glow'
                  : 'bg-surface-overlay border-surface-border text-ink-400 hover:border-brand/20 hover:text-ink-200'}`}>
              <div className="font-semibold">{lvl.label}</div>
              <div className="text-xs font-mono opacity-60 mt-0.5">{lvl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="label">Interview type</label>
        <div className="grid grid-cols-2 gap-2">
          {INTERVIEW_TYPES.map(t => (
            <button key={t.value} onClick={() => setInterviewType(t.value)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-display font-medium text-left transition-all
                ${interviewType === t.value
                  ? 'bg-brand/12 border-brand/40 text-brand-glow'
                  : 'bg-surface-overlay border-surface-border text-ink-400 hover:border-brand/20 hover:text-ink-200'}`}>
              <div className="text-base mb-1">{t.icon}</div>
              <div className="font-semibold">{t.label}</div>
              <div className="text-xs font-mono opacity-60">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={submit} disabled={loading} className="btn-primary w-full btn-lg">
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
          : <><HiLightningBolt className="w-4 h-4" /> Generate questions</>
        }
      </button>
    </div>
  )
}

// ── Question card ─────────────────────────────────────────────────────────────
function QuestionCard({ question, config, idx }) {
  const { saveQuestion, isQuestionSaved } = useApp()
  const { expandedAnswers, toggleAnswer, updateQuestion } = useInterview()
  const { toast } = useToast()
  const [loadingAnswer, setLoadingAnswer] = useState(false)

  const isOpen = expandedAnswers[question.id]
  const saved = isQuestionSaved(question.id)
  const dc = diffColor(question.difficulty)

  const handleCopy = async () => {
    const ok = await copyToClipboard(question.question)
    if (ok) toast.success('Copied to clipboard')
  }

  const handleSave = () => {
    if (saved) { toast.info('Already saved'); return }
    saveQuestion({ ...question, company: config?.company, role: config?.role })
    toast.success('Question saved')
  }

  const handleAnswer = async () => {
    if (question.answer) { toggleAnswer(question.id); return }
    setLoadingAnswer(true)
    try {
      const ans = await generateAnswer({
        question: question.question,
        role: config?.role,
        experience: config?.experience,
        company: config?.company,
      })
      updateQuestion(question.id, { answer: ans })
      toggleAnswer(question.id)
      toast.success('Answer generated')
    } catch (err) {
      toast.error(err.message || 'Failed to generate answer')
    } finally {
      setLoadingAnswer(false)
    }
  }

  return (
    <div className="card overflow-hidden animate-slide-up">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={`badge badge-${dc}`}>{question.difficulty || 'Medium'}</span>
            {question.topic && <span className="badge badge-ghost">{question.topic}</span>}
            {question.type && <span className="badge badge-ghost opacity-70 text-xs">{question.type}</span>}
          </div>
          <span className="text-ink-600 text-xs font-mono flex-shrink-0">#{idx + 1}</span>
        </div>

        <p className="font-mono text-sm text-ink-200 bg-surface border border-surface-border rounded-xl px-4 py-3 leading-relaxed">
          {question.question}
        </p>

        {question.hint && (
          <p className="mt-3 text-xs text-ink-500 italic font-mono">💡 {question.hint}</p>
        )}
      </div>

      {/* Expanded answer */}
      {isOpen && question.answer && (
        <div className="border-t border-surface-border bg-surface px-5 py-4 space-y-4 animate-slide-down">
          {['beginner', 'intermediate', 'expert'].map(level => {
            const a = question.answer[level]
            if (!a) return null
            const clr = { beginner: 'text-success', intermediate: 'text-warn', expert: 'text-danger' }[level]
            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wide ${clr}`}>{level}</span>
                  {a.duration && <span className="badge badge-ghost">{a.duration}</span>}
                </div>
                <p className="text-ink-300 text-sm leading-relaxed">{a.answer}</p>
                {a.keyPoints?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {a.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-400">
                        <span className="text-brand mt-0.5">→</span> {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {a.codeExample && a.codeExample.length > 5 && (
                  <pre className="mt-2 bg-void rounded-xl p-3 text-xs font-mono text-success/80 overflow-x-auto border border-surface-border">
                    {a.codeExample}
                  </pre>
                )}
              </div>
            )
          })}
          {question.answer.tips?.length > 0 && (
            <div>
              <p className="text-xs font-mono text-warn uppercase tracking-wide mb-1">Tips</p>
              {question.answer.tips.map((t, i) => <p key={i} className="text-xs text-ink-400 mb-0.5">• {t}</p>)}
            </div>
          )}
          {question.answer.commonMistakes?.length > 0 && (
            <div>
              <p className="text-xs font-mono text-danger uppercase tracking-wide mb-1">Common mistakes</p>
              {question.answer.commonMistakes.map((m, i) => <p key={i} className="text-xs text-ink-400 mb-0.5">✗ {m}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-surface-border bg-surface">
        <button onClick={handleAnswer} disabled={loadingAnswer} className="btn-secondary btn-sm">
          {loadingAnswer
            ? <div className="w-3.5 h-3.5 border border-ink-500 border-t-ink-200 rounded-full animate-spin" />
            : <HiSparkles className="w-3.5 h-3.5 text-brand" />
          }
          {question.answer ? (isOpen ? 'Hide answer' : 'Show answer') : loadingAnswer ? 'Generating...' : 'Generate answer'}
          {question.answer && (isOpen ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />)}
        </button>

        <button onClick={handleSave} className={`btn-sm ${saved ? 'btn-success' : 'btn-secondary'}`}>
          <HiBookmark className="w-3.5 h-3.5" />
          {saved ? 'Saved' : 'Save'}
        </button>

        <button onClick={handleCopy} className="btn-ghost btn-icon ml-auto" title="Copy question">
          <HiDuplicate className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'all',              label: 'All',       icon: HiSparkles },
  { id: 'technical',        label: 'Technical', icon: HiChip },
  { id: 'hr',               label: 'HR',        icon: HiUsers },
  { id: 'behavioral',       label: 'Behavioral',icon: HiAcademicCap },
  { id: 'company-specific', label: 'Company',   icon: HiOfficeBuilding },
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InterviewPage() {
  const { questions, setQuestions, isGenerating, setIsGenerating, config, startInterview, activeTab, setActiveTab } = useInterview()
  const { addHistory } = useApp()
  const { toast } = useToast()

  const handleGenerate = async (cfg) => {
    startInterview(cfg)
    setIsGenerating(true)
    try {
      const data = await generateQuestions(cfg)
      const all = data.all.map(q => ({ ...q, id: q.id || uid() }))
      setQuestions(all)
      addHistory({ ...cfg, type: 'questions', count: all.length })
      toast.success(`${all.length} questions generated for ${cfg.company}`)
    } catch (err) {
      toast.error(err.message || 'Generation failed. Check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const visible = activeTab === 'all' ? questions : questions.filter(q => q.category === activeTab)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Form — sticky on lg */}
        <div className="lg:sticky lg:top-4">
          <InterviewForm onGenerate={handleGenerate} loading={isGenerating} />
        </div>

        {/* Questions panel */}
        <div className="space-y-4">
          {/* Session header */}
          {questions.length > 0 && config && (
            <div className="flex items-center justify-between animate-fade-in">
              <div>
                <h3 className="font-display font-semibold text-ink-100">{config.company} — {config.role}</h3>
                <p className="text-ink-500 text-xs font-mono mt-0.5">{questions.length} questions · {config.experience} · {config.interviewType}</p>
              </div>
              <button onClick={() => handleGenerate(config)} disabled={isGenerating} className="btn-ghost btn-sm">
                <HiRefresh className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
          )}

          {/* Category tabs */}
          {questions.length > 0 && (
            <div className="flex gap-1 overflow-x-auto no-scrollbar bg-surface rounded-2xl p-1 border border-surface-border">
              {TABS.map(tab => {
                const cnt = tab.id === 'all' ? questions.length : questions.filter(q => q.category === tab.id).length
                if (cnt === 0 && tab.id !== 'all') return null
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-medium flex-shrink-0 transition-all
                      ${activeTab === tab.id ? 'bg-brand/15 text-brand-glow' : 'text-ink-500 hover:text-ink-200'}`}>
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                    <span className={`text-xs font-mono ${activeTab === tab.id ? 'text-brand/60' : 'text-ink-600'}`}>{cnt}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* States */}
          {isGenerating && <SkeletonQuestions />}

          {!isGenerating && questions.length === 0 && (
            <EmptyState
              icon="💡"
              title="No questions yet"
              description="Configure your session on the left and click Generate to get started."
            />
          )}

          {!isGenerating && visible.length > 0 && (
            <div className="space-y-3">
              {visible.map((q, i) => <QuestionCard key={q.id} question={q} config={config} idx={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}