export const APP_NAME = 'Interview Prep Pro'

export const COMPANIES = [
  { value: 'Google', label: 'Google', emoji: '🔵', tier: 'FAANG' },
  { value: 'Microsoft', label: 'Microsoft', emoji: '🟦', tier: 'FAANG' },
  { value: 'Amazon', label: 'Amazon', emoji: '🟠', tier: 'FAANG' },
  { value: 'Meta', label: 'Meta', emoji: '🔷', tier: 'FAANG' },
  { value: 'Apple', label: 'Apple', emoji: '⬛', tier: 'FAANG' },
  { value: 'Netflix', label: 'Netflix', emoji: '🔴', tier: 'FAANG' },
  { value: 'Adobe', label: 'Adobe', emoji: '🟥', tier: 'Top Tech' },
  { value: 'Atlassian', label: 'Atlassian', emoji: '🔹', tier: 'Top Tech' },
  { value: 'Salesforce', label: 'Salesforce', emoji: '☁️', tier: 'Top Tech' },
  { value: 'Oracle', label: 'Oracle', emoji: '🔴', tier: 'Enterprise' },
  { value: 'IBM', label: 'IBM', emoji: '🔵', tier: 'Enterprise' },
  { value: 'TCS', label: 'TCS', emoji: '🟦', tier: 'Indian IT' },
  { value: 'Infosys', label: 'Infosys', emoji: '🔷', tier: 'Indian IT' },
  { value: 'Wipro', label: 'Wipro', emoji: '🟠', tier: 'Indian IT' },
  { value: 'Accenture', label: 'Accenture', emoji: '🟣', tier: 'Consulting' },
  { value: 'Custom', label: 'Other / Custom', emoji: '✏️', tier: '' },
]

export const ROLES = [
  { value: 'Frontend Developer', label: 'Frontend Developer', icon: '🎨' },
  { value: 'React Developer', label: 'React Developer', icon: '⚛️' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🔄' },
  { value: 'Software Engineer', label: 'Software Engineer', icon: '💻' },
  { value: 'Backend Developer', label: 'Backend Developer', icon: '⚙️' },
  { value: 'UI/UX Developer', label: 'UI/UX Developer', icon: '✏️' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: '🔧' },
  { value: 'Data Scientist', label: 'Data Scientist', icon: '📊' },
  { value: 'ML Engineer', label: 'ML Engineer', icon: '🤖' },
  { value: 'Product Manager', label: 'Product Manager', icon: '📋' },
  { value: 'Custom', label: 'Other / Custom', icon: '✏️' },
]

export const EXPERIENCE_LEVELS = [
  { value: 'Fresher', label: 'Fresher (0 yrs)', desc: 'Just graduated, no professional exp.' },
  { value: '1-2 Years', label: '1–2 Years', desc: 'Junior level with some experience' },
  { value: '3-5 Years', label: '3–5 Years', desc: 'Mid-level with solid fundamentals' },
  { value: '5+ Years', label: '5+ Years', desc: 'Senior with deep domain expertise' },
]

export const INTERVIEW_TYPES = [
  { value: 'Technical', label: 'Technical', icon: '💻', desc: 'DSA, system design, coding' },
  { value: 'HR', label: 'HR', icon: '🤝', desc: 'Culture fit, motivational' },
  { value: 'Behavioral', label: 'Behavioral', icon: '🧠', desc: 'STAR method, leadership' },
  { value: 'Mixed', label: 'Mixed', icon: '🎯', desc: 'All types combined' },
]

export const TICKER_QUESTIONS = [
  'Explain the Virtual DOM and reconciliation algorithm in React...',
  'Design a URL shortener like bit.ly for 1B requests/day...',
  'What is the difference between TCP and UDP protocols?',
  'Implement an LRU Cache with O(1) get and put operations...',
  'Describe your experience with microservices architecture...',
  'How would you optimize a slow PostgreSQL query?',
  'Explain SOLID principles with real-world examples...',
  'Tell me about a time you led a project under pressure...',
  'How does garbage collection work in JavaScript?',
  'Design the backend for a real-time chat application...',
  'What are the trade-offs between REST and GraphQL?',
  'Describe how you would handle a production outage at 3 AM...',
]

export const LANDING_STATS = [
  { value: '50K+', label: 'Questions generated' },
  { value: '200+', label: 'Companies covered' },
  { value: '12K+', label: 'Mock sessions done' },
  { value: '94%', label: 'User success rate' },
]

export const DIFF_COLORS = {
  Easy: 'success',
  Medium: 'warn',
  Hard: 'danger',
}

export const CAT_META = {
  technical: { label: 'Technical', color: 'brand' },
  hr: { label: 'HR', color: 'success' },
  behavioral: { label: 'Behavioral', color: 'warn' },
  'company-specific': { label: 'Company', color: 'danger' },
}