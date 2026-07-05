import { useToast } from '@/context/ToastContext.jsx'
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi'

const STYLES = {
  success: { icon: HiCheckCircle,        bar: '#10B981', iconCls: 'text-success' },
  error:   { icon: HiExclamationCircle,  bar: '#F43F5E', iconCls: 'text-danger'  },
  warn:    { icon: HiExclamation,        bar: '#F59E0B', iconCls: 'text-warn'    },
  info:    { icon: HiInformationCircle,  bar: '#6C63FF', iconCls: 'text-brand'   },
}

function Toast({ id, message, type }) {
  const { remove } = useToast()
  const s = STYLES[type] || STYLES.info
  const Icon = s.icon

  return (
    <div className="relative flex items-start gap-3 px-4 py-3 rounded-2xl border border-surface-border bg-surface-raised shadow-xl max-w-sm w-full overflow-hidden animate-toast-in">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: s.bar }} />
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.iconCls}`} />
      <p className="text-ink-200 text-sm flex-1 leading-relaxed">{message}</p>
      <button onClick={() => remove(id)} className="text-ink-500 hover:text-ink-300 transition-colors mt-0.5 flex-shrink-0">
        <HiX className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToast()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} />
        </div>
      ))}
    </div>
  )
}