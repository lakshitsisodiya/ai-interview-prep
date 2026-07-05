export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6 animate-fade-in">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-ink-200 text-lg mb-2">{title}</h3>
      {description && <p className="text-ink-500 text-sm max-w-xs leading-relaxed mb-6">{description}</p>}
      {action}
    </div>
  )
}