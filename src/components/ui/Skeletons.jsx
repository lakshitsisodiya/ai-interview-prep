export function SkeletonLine({ cls = 'h-4 w-3/4' }) {
  return <div className={`skeleton ${cls}`} />
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1 mr-4">
          <SkeletonLine cls="h-4 w-3/4" />
          <SkeletonLine cls="h-3 w-1/2" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <SkeletonLine cls="h-3 w-full" />
      <SkeletonLine cls="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-8 w-32 rounded-lg" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonQuestions() {
  return (
    <div className="space-y-4">
      {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="card p-5 space-y-3">
          <SkeletonLine cls="h-3 w-20" />
          <SkeletonLine cls="h-8 w-16" />
          <SkeletonLine cls="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}