export const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatRelative = (ts) => {
  const d = Date.now() - ts
  const m = Math.floor(d / 60000)
  const h = Math.floor(d / 3600000)
  const days = Math.floor(d / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(ts)
}

export const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); return true } catch {}
  try {
    const el = document.createElement('textarea')
    el.value = text; el.style.position = 'fixed'; el.style.opacity = '0'
    document.body.appendChild(el); el.select(); document.execCommand('copy')
    document.body.removeChild(el); return true
  } catch { return false }
}

export const truncate = (str, max = 100) =>
  str && str.length > max ? str.slice(0, max).trimEnd() + '…' : str

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const scoreColor = (score) => {
  if (score >= 8) return 'success'
  if (score >= 5) return 'warn'
  return 'danger'
}

export const scoreLabel = (score) => {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Average'
  if (score >= 3) return 'Needs Work'
  return 'Poor'
}

export const diffColor = (diff) => {
  const map = { Easy: 'success', Medium: 'warn', Hard: 'danger' }
  return map[diff] || 'ghost'
}

export const exportText = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export const filterByQuery = (items, query, fields) => {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter(item => fields.some(f => item[f]?.toLowerCase().includes(q)))
}