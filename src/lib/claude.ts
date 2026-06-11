import type { Question, Difficulty, Section } from '../types'
import { sectionOf } from './taxonomy'
import { parseGrid } from './grid'

// ---- Optional AI mode -------------------------------------------------------
// This file is the ONLY place that talks to Anthropic's API. The whole app works
// with the AI turned off; these functions are used only when you enable it in
// Settings and paste a personal API key.
//
// SECURITY NOTE: calling the API directly from the browser exposes your key to
// anyone who can read the page. That's fine for local/personal use, but you must
// NEVER deploy a public site with your key embedded. (See Settings for the warning.)

const API_URL = 'https://api.anthropic.com/v1/messages'

export interface AiConfig {
  apiKey: string
  model: string
}

async function callClaude(cfg: AiConfig, system: string, user: string, maxTokens = 2000): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      // Required to call the API from a browser. Personal/local use ONLY.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!res.ok) {
    // Surface a human-readable message, not the raw JSON error body.
    let detail = ''
    try {
      const body = await res.text()
      try {
        detail = JSON.parse(body)?.error?.message ?? ''
      } catch {
        detail = body.slice(0, 200)
      }
    } catch {
      /* ignore */
    }
    const prefix =
      res.status === 401
        ? 'Invalid API key — check it in Settings.'
        : res.status === 429
          ? 'Rate limited — wait a moment and try again.'
          : res.status >= 500
            ? 'Anthropic service error — try again shortly.'
            : `Claude API error ${res.status}.`
    throw new Error(detail ? `${prefix} (${detail})` : prefix)
  }

  const data = await res.json()
  const blocks: unknown = data?.content
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((b: any) => (b && typeof b.text === 'string' ? b.text : ''))
    .join('')
    .trim()
}

// Pull the first JSON array out of the response, tolerating stray prose or ```json fences.
// (Exported for tests.)
export function extractJsonArray(text: string): unknown[] {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()

  const start = t.indexOf('[')
  const end = t.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('The model did not return a JSON array.')
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(t.slice(start, end + 1))
  } catch {
    // e.g. the response was cut off mid-array by the token limit.
    throw new Error('The model returned malformed JSON — try generating again.')
  }
  if (!Array.isArray(parsed)) throw new Error('Parsed JSON was not an array.')
  return parsed
}

const DIFFS: Difficulty[] = ['easy', 'medium', 'hard']

// Validate + clean one raw object from the model into a real Question (or null).
// (Exported for tests.)
export function normalizeQuestion(raw: any, skill: string, idx: number): Question | null {
  if (!raw || typeof raw !== 'object') return null

  const type = raw.type === 'grid' ? 'grid' : 'mcq'
  const prompt = String(raw.prompt ?? '').trim()
  const answer = String(raw.answer ?? '').trim()
  if (!prompt || !answer) return null

  const choices = Array.isArray(raw.choices) ? raw.choices.map((c: any) => String(c)) : undefined
  if (type === 'mcq') {
    // Enforce the Question contract: exactly 4 distinct choices, one of which
    // is the answer verbatim. (The UI letters choices A-D and keys by text.)
    if (!choices || choices.length !== 4) return null
    if (new Set(choices).size !== 4) return null
    if (!choices.includes(answer)) return null
  }
  // A grid answer the matcher can't parse (e.g. "x = 5") would make the question
  // permanently unanswerable — and once missed, stuck in the error log forever.
  if (type === 'grid' && parseGrid(answer) === null) return null

  const difficulty: Difficulty = DIFFS.includes(raw.difficulty) ? raw.difficulty : 'medium'
  const section: Section = sectionOf(skill)
  const rand = Math.random().toString(36).slice(2, 8)
  const id = `ai-${skill.replace(/\s+/g, '-').toLowerCase()}-${idx}-${rand}`

  return {
    id,
    section,
    domain: String(raw.domain ?? skill),
    skill,
    difficulty,
    type,
    prompt,
    choices: type === 'mcq' ? choices : undefined,
    answer,
    explanation: String(raw.explanation ?? '').trim() || 'No explanation provided.',
    trap: String(raw.trap ?? '').trim() || '—',
  }
}

/** (a) Generate fresh questions for any skill/difficulty in the exact Question shape. */
export async function generateQuestions(
  cfg: AiConfig,
  skill: string,
  difficulty: Difficulty,
  count: number,
): Promise<Question[]> {
  const section = sectionOf(skill)
  const system = [
    'You are an expert Digital SAT item writer.',
    'Write ORIGINAL practice questions that match the real Digital SAT in format, phrasing, and difficulty.',
    'Never reproduce real College Board questions.',
    'Return ONLY a JSON array — no prose, no markdown code fences.',
  ].join(' ')

  const shape = `Each array element must be an object with these keys:
{
  "domain": "a short sub-skill label",
  "type": "mcq" or "grid",
  "prompt": "the full question text, including any short passage",
  "choices": ["A","B","C","D"],   // EXACTLY 4 for mcq; omit this key entirely for grid
  "answer": "for mcq: the EXACT text of the correct choice; for grid: the numeric answer as a string",
  "explanation": "teach the underlying RULE and a quick test/habit — not just 'the answer is B'",
  "trap": "name the mistake the wrong answers are designed to cause"
}`

  const user = `Write ${count} ${difficulty} "${skill}" question(s) for the ${
    section === 'rw' ? 'Reading & Writing' : 'Math'
  } section.\n\n${shape}\n\nReturn ONLY the JSON array.`

  const text = await callClaude(cfg, system, user, 4000)
  const arr = extractJsonArray(text)

  const out: Question[] = []
  arr.forEach((raw, i) => {
    const q = normalizeQuestion(raw, skill, i)
    if (q) out.push(q)
  })
  if (out.length === 0) throw new Error('No valid questions came back. Try again.')
  return out
}

/** (b) Re-teach a concept the student just missed, with a brand-new example. */
export async function reExplain(cfg: AiConfig, q: Question): Promise<string> {
  const system =
    'You are a patient, concise SAT tutor. Re-teach the concept the student just missed using a BRAND-NEW original example (do not reuse the given question). Format: (1) the rule in one sentence, (2) a fresh mini-example, (3) a one-line test to apply under time pressure. Keep it under 120 words.'
  const user = `Skill: ${q.skill}\nThe student missed this question:\n"${q.prompt}"\nCorrect answer: ${q.answer}\n\nRe-explain the underlying concept with a new example.`
  return callClaude(cfg, system, user, 700)
}

/** (c) Grade a short free-response answer and give one concrete improvement. */
export async function gradeFreeResponse(cfg: AiConfig, promptText: string, answer: string): Promise<string> {
  const system =
    'You are an encouraging SAT writing coach. Give brief, specific feedback (3–5 sentences) and ONE concrete improvement the student can apply next time.'
  const user = `Task/prompt:\n${promptText}\n\nStudent's answer:\n${answer}\n\nEvaluate it and give one concrete improvement.`
  return callClaude(cfg, system, user, 700)
}
