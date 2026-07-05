export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
          <div className="absolute inset-0 rounded-2xl border-2 border-brand animate-pulse2" />
        </div>
        <p className="text-ink-500 text-sm font-mono">loading...</p>
      </div>
    </div>
  )
}