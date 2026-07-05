import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiLightningBolt, HiChatAlt2, HiBookOpen, HiChartBar, HiSparkles, HiCheck } from 'react-icons/hi'
import { TICKER_QUESTIONS, LANDING_STATS, COMPANIES } from '@/constants/index.js'

function QuestionTicker() {
  const doubled = [...TICKER_QUESTIONS, ...TICKER_QUESTIONS]
  return (
    <div className="relative rounded-2xl bg-surface border border-surface-border overflow-hidden" style={{ height: '200px' }}>
      {/* IDE header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-raised flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F43F5E', opacity: 0.7 }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B', opacity: 0.7 }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981', opacity: 0.7 }} />
        </div>
        <span className="text-xs font-mono text-ink-600 ml-1">interview_questions.txt</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="glow-dot" />
          <span className="text-xs font-mono text-ink-600">AI generating...</span>
        </div>
      </div>

      {/* Scrolling rows */}
      <div className="animate-ticker" style={{ willChange: 'transform' }}>
        {doubled.map((q, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2 border-b border-surface-border/40">
            <span className="font-mono text-xs text-brand/40 mt-0.5 w-5 text-right flex-shrink-0">
              {(i % TICKER_QUESTIONS.length) + 1}
            </span>
            <span className="font-mono text-xs text-ink-400 leading-relaxed">{q}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: HiLightningBolt, title: 'Company-specific questions', desc: 'Get real questions tailored to Google, Amazon, TCS, and 200+ companies based on your exact role and level.', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
  { icon: HiChatAlt2, title: 'Live mock interviews', desc: 'Practice with an AI that evaluates every answer, scores it 1–10, and gives detailed, line-by-line feedback.', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  { icon: HiBookOpen, title: 'Personalized study plans', desc: 'Tell the AI your target company and days remaining. Get a day-by-day prep roadmap built around what they actually test.', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  { icon: HiChartBar, title: 'Track your progress', desc: 'See mock scores improve over time, spot topics you keep missing, and know exactly when you\'re ready.', color: '#F43F5E', bg: 'rgba(244,63,94,0.1)' },
]

const HOW_IT_WORKS = [
  { label: 'Pick your target', desc: 'Choose the company, role, and your experience level.' },
  { label: 'Generate questions', desc: 'AI produces technical, HR, behavioral, and company-specific questions instantly.' },
  { label: 'Practice with feedback', desc: 'Run a mock interview. Get scored and coached on every answer.' },
  { label: 'Follow your study plan', desc: 'Fill weak spots with a personalized daily roadmap.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-glow text-xs font-mono">
              <HiSparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini
            </div>

            <h1 className="font-display font-extrabold text-5xl lg:text-6xl leading-[1.08] tracking-tight">
              <span className="text-ink-100">The interview prep</span>
              <br />
              <span className="text-gradient">that thinks for you.</span>
            </h1>

            <p className="text-ink-400 text-lg leading-relaxed max-w-md">
              Generate real interview questions for any company. Practice with AI. Get scored. Land the job.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-primary btn-lg">
                Start preparing — it&apos;s free
                <span>→</span>
              </button>
              <button onClick={() => navigate('/mock')} className="btn-secondary btn-lg">
                Try mock interview
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['No signup required', 'Free to use', 'AI-powered feedback'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-ink-500">
                  <HiCheck className="w-3.5 h-3.5 text-success" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-in">
            <QuestionTicker />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="py-10 px-6 border-y border-surface-border bg-surface/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {LANDING_STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-extrabold text-3xl text-ink-100 mb-1">{stat.value}</div>
              <div className="text-ink-500 text-xs font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="tag-label mb-3">What you get</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink-100">
              Everything you need to prepare
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover p-6 space-y-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: f.bg }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink-100 mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-ink-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Companies ─────────────────────────────────────── */}
      <section id="companies" className="py-16 px-6 bg-surface/30 border-y border-surface-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ink-600 text-xs font-mono uppercase tracking-widest mb-6">
            Questions for every company
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {COMPANIES.filter(c => c.value !== 'Custom').map(c => (
              <span key={c.value}
                className="px-3 py-1.5 rounded-xl bg-surface-overlay border border-surface-border text-ink-400 text-sm font-display hover:border-brand/30 hover:text-ink-200 transition-all cursor-default">
                {c.emoji} {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="tag-label mb-3">The process</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink-100">
              From zero to interview-ready
            </h2>
          </div>
          <div className="relative space-y-6">
            <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-brand/40 via-success/20 to-transparent hidden sm:block" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.label} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-2xl bg-brand/12 border border-brand/30 flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="font-mono font-bold text-brand text-sm">{i + 1}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-display font-semibold text-ink-100 mb-1">{step.label}</h3>
                  <p className="text-ink-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="border-glow rounded-3xl p-10 space-y-5">
            <div className="text-5xl">⚡</div>
            <h2 className="font-display font-bold text-3xl text-ink-100">
              Your next interview starts now.
            </h2>
            <p className="text-ink-500 text-sm">No account needed. Start in under 30 seconds.</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary btn-lg w-full">
              Start preparing free
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-surface-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiSparkles className="w-4 h-4 text-brand" />
            <span className="font-display font-bold text-ink-400 text-sm">Interview Prep Pro</span>
          </div>
          <p className="text-ink-600 text-xs font-mono">Built with Gemini AI · For students and job seekers</p>
        </div>
      </footer>
    </div>
  )
}
