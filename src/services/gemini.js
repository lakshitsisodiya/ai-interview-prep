import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
let genAI = null

function getClient() {
  if (!apiKey) {
    throw new Error(
      'Gemini API key not found.\n\nCreate a .env file in the project root with:\nVITE_GEMINI_API_KEY=your_key_here\n\nGet your key at https://aistudio.google.com/app/apikey'
    )
  }
  if (!genAI) genAI = new GoogleGenerativeAI(apiKey)
  return genAI
}

function getModel({ maxOutputTokens = 2048 } = {}) {
  return getClient().getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens,
    },
  })
}

function parseJSON(text) {
  const clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  try {
    return JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    throw new Error('AI returned an invalid response. Please try again.')
  }
}

// Wraps every Gemini call: normalizes 429s, keeps everything else as-is
async function callGemini(model, prompt) {
  try {
    const result = await model.generateContent(prompt)
    return parseJSON(result.response.text())
  } catch (err) {
    if (err?.message?.includes('429') || err?.status === 429) {
      throw new Error(
        'Gemini free-tier quota exceeded for now. Wait about a minute before trying again.'
      )
    }
    throw err
  }
}

// ── 1. Question Generation ─────────────────────────────────────────────────
export async function generateQuestions({ company, role, experience, interviewType }) {
  const model = getModel({ maxOutputTokens: 4096 }) // larger cap: up to 16 structured questions

  const prompt = `You are a senior technical interviewer at ${company}.
Generate interview questions for a ${role} candidate at ${experience} experience level.
Interview type: ${interviewType}.

Return ONLY a valid JSON object — no markdown, no explanation, no preamble.
Use this exact structure:
{
  "technical": [
    { "id": "t1", "question": "...", "category": "technical", "difficulty": "Easy|Medium|Hard", "topic": "...", "hint": "..." }
  ],
  "hr": [
    { "id": "hr1", "question": "...", "category": "hr", "difficulty": "Easy|Medium|Hard", "topic": "..." }
  ],
  "behavioral": [
    { "id": "b1", "question": "...", "category": "behavioral", "difficulty": "Easy|Medium|Hard", "topic": "...", "hint": "Use the STAR method" }
  ],
  "company_specific": [
    { "id": "cs1", "question": "...", "category": "company-specific", "difficulty": "Easy|Medium|Hard", "topic": "..." }
  ]
}

Rules:
- Default: 6 technical, 4 hr, 3 behavioral, 3 company_specific questions
- If interviewType is "Technical": 10 technical, 1 hr, 1 behavioral, 3 company_specific
- If interviewType is "HR": 2 technical, 6 hr, 4 behavioral, 3 company_specific
- Match difficulty to ${experience} level
- Make questions specific to ${company}'s actual interview style
- For ${company}: reference their real products, culture, and known engineering practices`

  const data = await callGemini(model, prompt)

  const all = [
    ...(data.technical || []),
    ...(data.hr || []),
    ...(data.behavioral || []),
    ...(data.company_specific || []),
  ].map((q, i) => ({ ...q, id: q.id || `q-${Date.now()}-${i}` }))

  return { ...data, all }
}

// ── 2. Answer Generation ───────────────────────────────────────────────────
export async function generateAnswer({ question, role, experience, company }) {
  const model = getModel({ maxOutputTokens: 3072 })

  const prompt = `You are an expert ${role} helping a ${experience} candidate prepare for ${company}.
Generate ideal interview answers for:
"${question}"

Return ONLY valid JSON — no markdown, no preamble:
{
  "beginner": {
    "answer": "Complete answer text...",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "duration": "1-2 min"
  },
  "intermediate": {
    "answer": "More detailed answer...",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "codeExample": "// optional, only if relevant",
    "duration": "2-3 min"
  },
  "expert": {
    "answer": "Deep, nuanced answer with edge cases...",
    "keyPoints": ["point 1", "point 2", "point 3"],
    "codeExample": "// optional",
    "deepDive": "Advanced concepts, trade-offs, production considerations...",
    "duration": "3-5 min"
  },
  "tips": ["tip 1", "tip 2"],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "followUpQuestions": ["follow-up 1", "follow-up 2"]
}`

  return callGemini(model, prompt)
}

// ── 3. Mock Interview Feedback ─────────────────────────────────────────────
export async function generateFeedback({ question, userAnswer, role, experience, company }) {
  const model = getModel({ maxOutputTokens: 1536 })

  const prompt = `You are a strict but constructive interviewer at ${company} evaluating a ${role} (${experience}) candidate.

Question asked: "${question}"
Candidate's answer: "${userAnswer}"

Evaluate honestly and return ONLY valid JSON — no markdown, no preamble:
{
  "score": 7,
  "verdict": "Good|Excellent|Average|Needs Work|Poor",
  "scoreBreakdown": {
    "technicalAccuracy": 8,
    "communication": 7,
    "completeness": 6,
    "confidence": 7
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvedAnswer": "A complete, polished version of the answer...",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"]
}

Rules:
- Score is out of 10; be honest, not generous
- Be specific in feedback, not vague
- improvedAnswer must be a full, usable answer
- Calibrate scoring to ${experience} level`

  return callGemini(model, prompt)
}

// ── 4. Study Plan Generation ───────────────────────────────────────────────
export async function generateStudyPlan({ company, role, days }) {
  const model = getModel({ maxOutputTokens: 4096 })

  const prompt = `You are a career coach creating a ${days}-day interview prep plan for a ${role} role at ${company}.

Return ONLY valid JSON — no markdown, no preamble:
{
  "overview": "Brief summary of the plan...",
  "totalHours": 40,
  "phases": [
    {
      "phase": 1,
      "title": "Phase name",
      "days": "Days 1-7",
      "focus": "What this phase focuses on",
      "topics": [
        {
          "name": "Topic name",
          "subtopics": ["subtopic 1", "subtopic 2"],
          "resources": ["Resource 1", "Resource 2"],
          "practiceProblems": 5,
          "priority": "High|Medium|Low"
        }
      ],
      "dailyGoal": "What to achieve each day in this phase",
      "milestone": "End-of-phase milestone"
    }
  ],
  "weeklySchedule": {
    "Monday": "Focus area",
    "Tuesday": "Focus area",
    "Wednesday": "Focus area",
    "Thursday": "Focus area",
    "Friday": "Focus area",
    "Saturday": "Focus area",
    "Sunday": "Rest + review"
  },
  "companyInsights": {
    "interviewFormat": "Description of ${company}'s interview process",
    "keyTechnologies": ["tech 1", "tech 2"],
    "focusAreas": ["area 1", "area 2"],
    "tips": ["tip 1", "tip 2"]
  },
  "resources": [
    { "name": "Resource name", "type": "book|website|course|platform", "priority": "High|Medium" }
  ]
}

Rules:
- Adapt intensity to ${days} days (< 7 days = very intensive; > 30 = gradual)
- Number of phases should match the timeframe realistically
- Prioritize topics ${company} is known to test heavily
- Be specific and actionable`

  return callGemini(model, prompt)
}

// ── 5. Next Mock Interview Question ───────────────────────────────────────
export async function getNextQuestion({ company, role, experience, previousQuestions, history }) {
  const model = getModel({ maxOutputTokens: 512 })

  const historySnippet = (history || [])
    .filter(m => m.role === 'ai' || m.role === 'user')
    .slice(-6)
    .map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n')

  const prompt = `You are a ${company} interviewer conducting a ${role} interview (${experience} level).
Previous questions asked: ${previousQuestions?.length ? previousQuestions.join(' | ') : 'none yet'}

Recent conversation:
${historySnippet || 'Interview just started.'}

Ask the next interview question. Make it:
1. Relevant to ${role} at ${experience} level
2. Different from all previous questions
3. A natural progression from the conversation

Return ONLY valid JSON — no markdown, no preamble:
{
  "question": "The interview question...",
  "category": "technical|hr|behavioral",
  "difficulty": "Easy|Medium|Hard",
  "topic": "Topic name"
}`

  return callGemini(model, prompt)
}
