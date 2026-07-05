import { createContext, useContext, useState, useCallback } from 'react'

const InterviewContext = createContext(null)

export function InterviewProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [expandedAnswers, setExpandedAnswers] = useState({})

  const startInterview = useCallback((cfg) => {
    setConfig(cfg)
    setQuestions([])
    setExpandedAnswers({})
    setActiveTab('all')
  }, [])

  const clearInterview = useCallback(() => {
    setConfig(null)
    setQuestions([])
    setExpandedAnswers({})
  }, [])

  const toggleAnswer = useCallback((qId) => {
    setExpandedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }))
  }, [])

  const updateQuestion = useCallback((qId, updates) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, ...updates } : q))
  }, [])

  return (
    <InterviewContext.Provider value={{
      config, setConfig, startInterview, clearInterview,
      questions, setQuestions,
      isGenerating, setIsGenerating,
      activeTab, setActiveTab,
      expandedAnswers, toggleAnswer,
      updateQuestion,
    }}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const ctx = useContext(InterviewContext)
  if (!ctx) throw new Error('useInterview must be inside InterviewProvider')
  return ctx
}