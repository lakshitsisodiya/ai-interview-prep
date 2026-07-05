import { Suspense, lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext.jsx'
import { AppProvider } from '@/context/AppContext.jsx'
import { InterviewProvider } from '@/context/InterviewContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'
import AppRouter from '@/routes/AppRouter.jsx'
import ToastContainer from '@/components/ui/ToastContainer.jsx'

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #2A2A3D', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppProvider>
            <InterviewProvider>
              <Suspense fallback={<Spinner />}>
                <AppRouter />
              </Suspense>
              <ToastContainer />
            </InterviewProvider>
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}


