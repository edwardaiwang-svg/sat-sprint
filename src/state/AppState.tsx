import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Question } from '../types'
import { SEED_QUESTIONS } from '../data/questions'
import { store } from '../lib/storage'
import type { Attempt, ErrorEntry, Settings } from '../lib/storage'
import { nextErrorEntry } from '../lib/errorLog'
import { sectionOf } from '../lib/taxonomy'

// AppStateProvider is the heart of the app. It holds all progress + settings in
// React state, mirrors every change into localStorage, and exposes a few actions.
// Any screen can read or update shared state with the useApp() hook.

type Theme = 'dark' | 'light'

interface AppContextValue {
  questions: Question[] // seed bank + any AI/custom questions
  attempts: Attempt[]
  errorLog: Record<string, ErrorEntry>
  settings: Settings
  theme: Theme
  missedQuestionIds: string[]
  recordAnswer: (q: Question, correct: boolean) => void
  resetProgress: () => void
  addCustomQuestions: (qs: Question[]) => void
  updateSettings: (s: Settings) => void
  setTheme: (t: Theme) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Question[]>(() => store.loadCustom())
  const [attempts, setAttempts] = useState<Attempt[]>(() => store.loadAttempts())
  const [errorLog, setErrorLog] = useState<Record<string, ErrorEntry>>(() => store.loadErrorLog())
  const [settings, setSettings] = useState<Settings>(() => store.loadSettings())
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = store.loadTheme()
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Keep the <html> class, storage, and the browser-chrome color (the
  // theme-color meta tag) in sync whenever the theme changes.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    store.saveTheme(theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f8fafc')
  }, [theme])

  // Persist progress via effects (not inside state updaters) so React
  // StrictMode's double-invoked updaters stay side-effect free.
  useEffect(() => {
    store.saveAttempts(attempts)
  }, [attempts])
  useEffect(() => {
    store.saveErrorLog(errorLog)
  }, [errorLog])

  // If a second tab writes progress, pick it up instead of overwriting it
  // later with this tab's stale copy. ('storage' only fires in OTHER tabs.)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'sat.attempts') setAttempts(store.loadAttempts())
      if (e.key === 'sat.errorLog') setErrorLog(store.loadErrorLog())
      if (e.key === 'sat.customQuestions') setCustom(store.loadCustom())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const questions = useMemo(() => [...SEED_QUESTIONS, ...custom], [custom])

  const missedQuestionIds = useMemo(
    () => Object.keys(errorLog).filter((id) => errorLog[id]?.active),
    [errorLog],
  )

  // The single place an answer is recorded. Updates both the attempt history
  // (for stats) and the error log (the graduation rule lives in lib/errorLog.ts).
  // Persistence happens in the effects above, so these updaters stay pure.
  function recordAnswer(q: Question, correct: boolean) {
    const now = Date.now()
    const attempt: Attempt = {
      questionId: q.id,
      section: sectionOf(q.skill),
      skill: q.skill,
      correct,
      ts: now,
    }
    setAttempts((prev) => [...prev, attempt])
    setErrorLog((prev) => ({ ...prev, [q.id]: nextErrorEntry(prev[q.id], correct, now) }))
  }

  function resetProgress() {
    store.clearProgress()
    setAttempts([])
    setErrorLog({})
  }

  function addCustomQuestions(qs: Question[]) {
    setCustom((prev) => {
      const next = [...prev, ...qs]
      store.saveCustom(next)
      return next
    })
  }

  function updateSettings(s: Settings) {
    setSettings(s)
    store.saveSettings(s)
  }

  function setTheme(t: Theme) {
    setThemeState(t)
  }

  const value: AppContextValue = {
    questions,
    attempts,
    errorLog,
    settings,
    theme,
    missedQuestionIds,
    recordAnswer,
    resetProgress,
    addCustomQuestions,
    updateSettings,
    setTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppStateProvider')
  return ctx
}
