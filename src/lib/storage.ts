import type { Question, Section } from '../types'

// Everything the app remembers lives in localStorage under these keys.
// (No backend, no login — your progress simply stays in this browser.)
const KEYS = {
  attempts: 'sat.attempts',
  errorLog: 'sat.errorLog',
  custom: 'sat.customQuestions',
  settings: 'sat.settings',
  theme: 'sat.theme',
} as const

/** One record per question you've ever answered. The stats are computed from these. */
export interface Attempt {
  questionId: string
  section: Section
  skill: string
  correct: boolean
  ts: number
}

/** Tracks the error-log graduation rule: a missed question clears after 2 correct in a row. */
export interface ErrorEntry {
  consecutiveCorrect: number
  active: boolean
  lastMissTs: number
}

export interface Settings {
  aiEnabled: boolean
  apiKey: string
  model: string
}

export const DEFAULT_SETTINGS: Settings = {
  aiEnabled: false,
  apiKey: '',
  model: 'claude-sonnet-4-6',
}

// ---- Tiny typed wrappers around localStorage (fail safely if it's unavailable) ----

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked (e.g. private mode). For a personal app we just skip it.
  }
}

// Guards against corrupt-but-valid JSON (e.g. a key manually edited to `5`):
// without these, a bad value white-screens the app at mount.
function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

function asObject<T extends object>(v: unknown): T {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as T) : ({} as T)
}

/** Keep only custom questions the UI can actually render and grade. */
function validQuestion(q: unknown): q is Question {
  if (!q || typeof q !== 'object') return false
  const c = q as Partial<Question>
  if (!c.id || !c.prompt || !c.answer || !c.skill) return false
  if (c.type === 'mcq') return Array.isArray(c.choices) && c.choices.includes(c.answer)
  if (c.type === 'grid') return true
  return false
}

// Stamp a schema version so a future release can migrate old data instead of
// guessing. Bump this when the shape of any sat.* value changes.
const SCHEMA_VERSION = '1'
try {
  if (localStorage.getItem('sat.schemaVersion') === null) {
    localStorage.setItem('sat.schemaVersion', SCHEMA_VERSION)
  }
} catch {
  /* ignore */
}

export const store = {
  loadAttempts: () => asArray<Attempt>(read<unknown>(KEYS.attempts, [])),
  saveAttempts: (a: Attempt[]) => write(KEYS.attempts, a),

  loadErrorLog: () => asObject<Record<string, ErrorEntry>>(read<unknown>(KEYS.errorLog, {})),
  saveErrorLog: (e: Record<string, ErrorEntry>) => write(KEYS.errorLog, e),

  loadCustom: () => asArray<unknown>(read<unknown>(KEYS.custom, [])).filter(validQuestion),
  saveCustom: (q: Question[]) => write(KEYS.custom, q),

  loadSettings: (): Settings => ({ ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) }),
  saveSettings: (s: Settings) => write(KEYS.settings, s),

  // Theme is stored as a raw string (not JSON) so the inline script in index.html can read it.
  loadTheme: (): 'dark' | 'light' | null => {
    try {
      const t = localStorage.getItem(KEYS.theme)
      return t === 'dark' || t === 'light' ? t : null
    } catch {
      return null
    }
  },
  saveTheme: (t: 'dark' | 'light') => {
    try {
      localStorage.setItem(KEYS.theme, t)
    } catch {
      /* ignore */
    }
  },

  /** Wipes progress (attempts + error log) but keeps your settings and custom questions. */
  clearProgress: () => {
    write(KEYS.attempts, [])
    write(KEYS.errorLog, {})
  },
}
