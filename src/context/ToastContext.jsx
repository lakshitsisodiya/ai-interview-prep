import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)
let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_id
    setToasts(prev => [...prev.slice(-4), { id, message, type }])
    setTimeout(() => remove(id), duration)
  }, [remove])

  const toast = {
    success: (msg) => add(msg, 'success'),
    error: (msg) => add(msg, 'error', 5000),
    info: (msg) => add(msg, 'info'),
    warn: (msg) => add(msg, 'warn'),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}