import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext(null)

const KEYS = {
  SAVED: 'aip-saved-questions',
  HISTORY: 'aip-history',
  STUDY_PLANS: 'aip-study-plans',
  MOCK_SESSIONS: 'aip-mock-sessions',
}

function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function AppProvider({ children }) {
  const [savedQuestions, setSavedQuestions] = useState(() => load(KEYS.SAVED))
  const [history, setHistory] = useState(() => load(KEYS.HISTORY))
  const [studyPlans, setStudyPlans] = useState(() => load(KEYS.STUDY_PLANS))
  const [mockSessions, setMockSessions] = useState(() => load(KEYS.MOCK_SESSIONS))
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => { save(KEYS.SAVED, savedQuestions) }, [savedQuestions])
  useEffect(() => { save(KEYS.HISTORY, history) }, [history])
  useEffect(() => { save(KEYS.STUDY_PLANS, studyPlans) }, [studyPlans])
  useEffect(() => { save(KEYS.MOCK_SESSIONS, mockSessions) }, [mockSessions])

  const saveQuestion = useCallback((q) => {
    const item = { ...q, savedAt: Date.now(), id: q.id || `q-${Date.now()}` }
    setSavedQuestions(prev => {
      if (prev.find(p => p.id === item.id || p.question === item.question)) return prev
      return [item, ...prev]
    })
  }, [])

  const removeQuestion = useCallback((id) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id))
  }, [])

  const isQuestionSaved = useCallback((id) => {
    return savedQuestions.some(q => q.id === id)
  }, [savedQuestions])

  const addHistory = useCallback((entry) => {
    setHistory(prev => [{ ...entry, id: `h-${Date.now()}`, createdAt: Date.now() }, ...prev].slice(0, 50))
  }, [])

  const removeHistory = useCallback((id) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }, [])

  const saveStudyPlan = useCallback((plan) => {
    setStudyPlans(prev => [{ ...plan, id: `sp-${Date.now()}`, createdAt: Date.now() }, ...prev].slice(0, 20))
  }, [])

  const removeStudyPlan = useCallback((id) => {
    setStudyPlans(prev => prev.filter(p => p.id !== id))
  }, [])

  const saveMockSession = useCallback((session) => {
    setMockSessions(prev => [{ ...session, id: `ms-${Date.now()}`, createdAt: Date.now() }, ...prev].slice(0, 30))
  }, [])

  const getStats = useCallback(() => {
    const scores = mockSessions
      .filter(s => s.avgScore)
      .map(s => parseFloat(s.avgScore))
    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null
    return {
      totalSessions: history.length,
      mockCompleted: mockSessions.length,
      avgScore: avg,
      totalSaved: savedQuestions.length,
    }
  }, [history, mockSessions, savedQuestions])

  return (
    <AppContext.Provider value={{
      savedQuestions, saveQuestion, removeQuestion, isQuestionSaved,
      history, addHistory, removeHistory,
      studyPlans, saveStudyPlan, removeStudyPlan,
      mockSessions, saveMockSession,
      searchOpen, setSearchOpen,
      getStats,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}