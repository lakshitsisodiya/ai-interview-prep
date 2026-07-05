import { useState, useRef, useEffect, useCallback } from 'react'
import { HiPaperAirplane, HiSparkles, HiRefresh, HiThumbUp, HiThumbDown, HiLightBulb } from 'react-icons/hi'
import { useApp } from '@/context/AppContext.jsx'
import { useToast } from '@/context/ToastContext.jsx'
import { generateFeedback, getNextQuestion } from '@/services/gemini.js'
import { COMPANIES, ROLES, EXPERIENCE_LEVELS } from '@/constants/index.js'
import ScoreRing from '@/components/ui/ScoreRing.jsx'
import { scoreColor } from '@/utils/index.js'

const MAX_Q = 5

// ── Config screen ─────────────────────────────────────────────────────────────
function ConfigScreen({ onStart }) {
  const [company, setCompany] = useState('Google')
  const [role, setRole] = useState('Frontend Developer')
  const [experience, setExperience] = useState('Fresher')

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card p-7 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4">
            <HiSparkles className="w-7 h-7 text-success" />
          </div>
          <h2 className="font-display font-bold text-ink-100 text-xl mb-1">Mock Interview</h2>
          <p className="text-ink-500 text-sm">An AI interviewer will ask real questions and score every answer.</p>
        </div>

        <div className="form-group">
          <label className="label">Company</label>
          <select value={company} onChange={e => setCompany(e.target.value)} className="select">
            {COMPANIES.filter(c => c.value !== 'Custom').map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="select">
            {ROLES.filter(r => r.value !== 'Custom').map(r => (
              <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Experience</label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVELS.map(lvl => (
              <button key={lvl.value} onClick={() => setExperience(lvl.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-display font-medium transition-all text-left
                  ${experience === lvl.value
                    ? 'bg-success/12 border-success/40 text-success'
                    : 'bg-surface-overlay border-surface-border text-ink-400 hover:border-success/20'}`}>
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onStart({ company, role, experience })} className="btn-success w-full btn-lg">
          <HiSparkles className="w-5 h-5" />
          Start interview
        </button>
      </div>
    </div>
  )
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="w-2 h-2 rounded-full bg-ink-500 animate-dot-1 inline-block" />
      <span className="w-2 h-2 rounded-full bg-ink-500 animate-dot-2 inline-block" />
      <span className="w-2 h-2 rounded-full bg-ink-500 animate-dot-3 inline-block" />
    </div>
  )
}

// ── Feedback display ──────────────────────────────────────────────────────────
function FeedbackCard({ feedback }) {
  const sc = scoreColor(feedback.score)
  const bg = { success: 'bg-success/8 border-success/20', warn: 'bg-warn/8 border-warn/20', danger: 'bg-danger/8 border-danger/20' }[sc]

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${bg}`}>
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-ink-200 text-sm">Feedback</span>
        <ScoreRing score={feedback.score} size={60} />
      </div>

      {feedback.scoreBreakdown && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(feedback.scoreBreakdown).map(([key, val]) => (
            <div key={key} className="bg-surface/50 rounded-xl px-3 py-2">
              <p className="text-xs font-mono text-ink-500 capitalize mb-1.5">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden">
                  <div className={`h-full bg-${scoreColor(val)} rounded-full transition-all`}
                    style={{ width: `${val * 10}%` }} />
                </div>
                <span className={`text-xs font-mono font-bold text-${scoreColor(val)}`}>{val}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {feedback.strengths?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <HiThumbUp className="w-3.5 h-3.5 text-success" />
            <p className="text-xs font-mono text-success uppercase tracking-wide">Strengths</p>
          </div>
          {feedback.strengths.map((s, i) => <p key={i} className="text-xs text-ink-300 mb-0.5">• {s}</p>)}
        </div>
      )}

      {feedback.weaknesses?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <HiThumbDown className="w-3.5 h-3.5 text-danger" />
            <p className="text-xs font-mono text-danger uppercase tracking-wide">Needs work</p>
          </div>
          {feedback.weaknesses.map((w, i) => <p key={i} className="text-xs text-ink-300 mb-0.5">• {w}</p>)}
        </div>
      )}

      {feedback.improvedAnswer && (
        <div className="bg-surface/60 rounded-xl p-3">
          <p className="text-xs font-mono text-brand mb-1.5">✨ Improved answer</p>
          <p className="text-xs text-ink-300 leading-relaxed">{feedback.improvedAnswer}</p>
        </div>
      )}

      {feedback.suggestions?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <HiLightBulb className="w-3.5 h-3.5 text-warn" />
            <p className="text-xs font-mono text-warn uppercase tracking-wide">Suggestions</p>
          </div>
          {feedback.suggestions.map((s, i) => <p key={i} className="text-xs text-ink-300 mb-0.5">→ {s}</p>)}
        </div>
      )}
    </div>
  )
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function Bubble({ msg, config }) {
  const isAI = msg.role === 'ai'

  return (
    <div className={`flex gap-3 animate-slide-up ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 text-sm
        ${isAI ? 'bg-success/10 border-success/30' : 'bg-brand/10 border-brand/30'}`}>
        {isAI ? '🤖' : '👤'}
      </div>
      <div className={`space-y-1.5 max-w-[85%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <p className="text-xs font-mono text-ink-600">
          {isAI ? `${config?.company} Interviewer` : 'You'}
          {msg.category && <span className="text-brand/60 ml-2">{msg.category}</span>}
        </p>

        {msg.role === 'ai' && (
          <div className="bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm p-4">
            <p className="font-mono text-sm text-ink-200 leading-relaxed">{msg.content}</p>
            {msg.difficulty && (
              <span className={`badge badge-${msg.difficulty === 'Hard' ? 'danger' : msg.difficulty === 'Medium' ? 'warn' : 'success'} mt-2`}>
                {msg.difficulty}
              </span>
            )}
          </div>
        )}

        {msg.role === 'user' && (
          <div className="bg-brand/12 border border-brand/20 rounded-2xl rounded-tr-sm p-4">
            <p className="text-sm text-ink-200 leading-relaxed">{msg.content}</p>
          </div>
        )}

        {msg.role === 'typing' && (
          <div className="bg-surface-raised border border-surface-border rounded-2xl rounded-tl-sm">
            <TypingDots />
          </div>
        )}

        {msg.role === 'feedback' && msg.feedback && <FeedbackCard feedback={msg.feedback} />}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MockPage() {
  const [cfg, setCfg] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [prevQs, setPrevQs] = useState([])
  const [qCount, setQCount] = useState(0)
  const [done, setDone] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const { saveMockSession, addHistory } = useApp()
  const { toast } = useToast()

  const scrollDown = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  useEffect(() => { scrollDown() }, [msgs, scrollDown])

  const addMsg = (m) => setMsgs(prev => [...prev, { id: `msg-${Date.now()}-${Math.random()}`, ...m }])

  const removeTyping = () => setMsgs(prev => prev.filter(m => m.role !== 'typing'))

  const startSession = async (config) => {
    setCfg(config)
    setMsgs([])
    setPrevQs([])
    setQCount(0)
    setDone(false)
    setLoading(true)

    try {
      addMsg({
        role: 'ai',
        content: `Hello! I'm your ${config.company} interviewer for the ${config.role} position. We'll go through ${MAX_Q} questions. Take your time and answer as you would in a real interview. Let's begin.`,
      })

      const q = await getNextQuestion({ ...config, previousQuestions: [], history: [] })
      addMsg({ role: 'ai', content: q.question, category: q.category, difficulty: q.difficulty })
      setPrevQs([q.question])
      setQCount(1)
    } catch (err) {
      toast.error(err.message || 'Failed to start. Check your API key in .env file.')
      setCfg(null)
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    const answer = input.trim()
    if (!answer || loading) return
    setInput('')
    setLoading(true)

    const lastQ = [...msgs].reverse().find(m => m.role === 'ai' && m.category)
    addMsg({ role: 'user', content: answer })
    addMsg({ role: 'typing' })

    try {
      const fb = await generateFeedback({
        question: lastQ?.content || '',
        userAnswer: answer,
        role: cfg.role,
        experience: cfg.experience,
        company: cfg.company,
      })

      removeTyping()
      setMsgs(prev => [...prev, { id: `fb-${Date.now()}`, role: 'feedback', feedback: fb }])

      if (qCount >= MAX_Q) {
        addMsg({
          role: 'ai',
          content: `That's all ${MAX_Q} questions! You've completed this mock interview. Review your feedback above — consistent practice is what separates good candidates from great ones. Well done for finishing!`,
        })
        setDone(true)

        const sessionScores = msgs.filter(m => m.feedback?.score).map(m => m.feedback.score)
        sessionScores.push(fb.score)
        const avg = (sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length).toFixed(1)
        saveMockSession({ ...cfg, type: 'mock', avgScore: avg, questionCount: MAX_Q })
        addHistory({ ...cfg, type: 'mock', avgScore: avg })
      } else {
        const nextQ = await getNextQuestion({
          ...cfg,
          previousQuestions: prevQs,
          history: msgs.slice(-8),
        })
        addMsg({ role: 'ai', content: nextQ.question, category: nextQ.category, difficulty: nextQ.difficulty })
        setPrevQs(p => [...p, nextQ.question])
        setQCount(c => c + 1)
      }
    } catch (err) {
      removeTyping()
      toast.error(err.message || 'Failed to evaluate answer')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => { setCfg(null); setMsgs([]); setPrevQs([]); setDone(false); setQCount(0) }

  if (!cfg) return <ConfigScreen onStart={startSession} />

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Session header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-surface-border bg-surface/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          {!done && <div className="glow-dot" />}
          <div>
            <p className="font-display font-semibold text-ink-200 text-sm">{cfg.company} — {cfg.role}</p>
            <p className="text-ink-600 text-xs font-mono">{done ? 'Session complete ✓' : `Question ${qCount} of ${MAX_Q}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {Array.from({ length: MAX_Q }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < qCount ? 'bg-success' : 'bg-surface-border'}`} />
            ))}
          </div>
          <button onClick={reset} className="btn-ghost btn-sm">
            <HiRefresh className="w-3.5 h-3.5" /> New session
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-6">
        {msgs.map(m => <Bubble key={m.id} msg={m} config={cfg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input / Done state */}
      {!done ? (
        <div className="px-4 lg:px-6 py-4 border-t border-surface-border bg-surface/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
              disabled={loading}
              placeholder="Type your answer... (Enter to submit, Shift+Enter for new line)"
              rows={3}
              className="input resize-none flex-1 text-sm leading-relaxed"
              maxLength={2000}
            />
            <button onClick={submit} disabled={!input.trim() || loading}
              className="btn-success flex-shrink-0 h-[76px] px-4">
              {loading
                ? <div className="w-5 h-5 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                : <HiPaperAirplane className="w-5 h-5" />
              }
            </button>
          </div>
          <p className="text-center text-xs text-ink-600 font-mono mt-2">
            Enter to submit · Shift+Enter for new line · {input.length}/2000
          </p>
        </div>
      ) : (
        <div className="px-4 py-4 border-t border-surface-border bg-surface/80 flex-shrink-0 text-center">
          <div className="flex items-center justify-center gap-4">
            <button onClick={reset} className="btn-primary">
              <HiRefresh className="w-4 h-4" /> Practice again
            </button>
            <p className="text-ink-500 text-xs">Session saved to history</p>
          </div>
        </div>
      )}
    </div>
  )
}