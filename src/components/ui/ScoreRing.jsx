import { scoreColor, scoreLabel } from '@/utils/index.js'

const STROKE = { success: '#10B981', warn: '#F59E0B', danger: '#F43F5E' }
const TEXT   = { success: 'text-success', warn: 'text-warn', danger: 'text-danger' }

export default function ScoreRing({ score, size = 72 }) {
  const color = scoreColor(score)
  const r = (size / 2) - 5
  const circ = 2 * Math.PI * r
  const fill = (score / 10) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={STROKE[color]} strokeWidth={4}
            strokeDasharray={`${fill} ${circ - fill}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold ${TEXT[color]}`} style={{ fontSize: size * 0.25 }}>
            {score}
          </span>
        </div>
      </div>
      <span className={`text-xs font-mono font-medium uppercase tracking-wide ${TEXT[color]}`}>
        {scoreLabel(score)}
      </span>
    </div>
  )
}