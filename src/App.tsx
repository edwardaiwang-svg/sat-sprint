import { useState, type ReactNode } from 'react'
import type { Question } from './types'
import { useApp } from './state/AppState'
import { bySkill } from './lib/select'
import { Home } from './screens/Home'
import { Dashboard } from './screens/Dashboard'
import { ErrorLog } from './screens/ErrorLog'
import { Settings } from './screens/Settings'
import { QuestionRunner } from './components/QuestionRunner'
import { HomeIcon, ChartIcon, FlagIcon, GearIcon, SunIcon, MoonIcon } from './components/Icons'

type Tab = 'home' | 'dashboard' | 'errors' | 'settings'

interface SessionSpec {
  questions: Question[]
  title: string
}

export default function App() {
  const { theme, setTheme, missedQuestionIds, questions } = useApp()
  const [tab, setTab] = useState<Tab>('home')
  const [session, setSession] = useState<SessionSpec | null>(null)
  // Bumped on every new set so the QuestionRunner remounts fresh (resets its
  // index/score) even when one set launches another — e.g. the summary's
  // "drill your weakest" recommendation.
  const [runId, setRunId] = useState(0)

  function startSession(questions: Question[], title: string) {
    if (questions.length === 0) return
    setSession({ questions, title })
    setRunId((n) => n + 1)
    window.scrollTo(0, 0)
  }

  // An active practice set takes over the whole screen — calm and distraction-free.
  if (session) {
    return (
      <QuestionRunner
        key={runId}
        questions={session.questions}
        title={session.title}
        onExit={() => {
          setSession(null)
          window.scrollTo(0, 0)
        }}
        onDrillSkill={(skill) => startSession(bySkill(questions, skill, 8), `Drill: ${skill}`)}
      />
    )
  }

  const tabs: { id: Tab; label: string; icon: ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'dashboard', label: 'Progress', icon: <ChartIcon /> },
    { id: 'errors', label: 'Misses', icon: <FlagIcon />, badge: missedQuestionIds.length },
    { id: 'settings', label: 'Settings', icon: <GearIcon /> },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4">
      {/* Slim header with a quick theme toggle */}
      <header className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
            S
          </span>
          <span className="font-bold tracking-tight">SAT Sprint</span>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* Active screen */}
      <main className="flex-1 pb-28">
        {tab === 'home' && <Home startSession={startSession} />}
        {tab === 'dashboard' && <Dashboard startSession={startSession} />}
        {tab === 'errors' && <ErrorLog startSession={startSession} />}
        {tab === 'settings' && <Settings startSession={startSession} />}
      </main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="safe-bottom mx-auto flex max-w-2xl items-stretch px-2 pt-1">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id)
                  window.scrollTo(0, 0)
                }}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <span className="relative">
                  {t.icon}
                  {t.badge ? (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {t.badge > 99 ? '99+' : t.badge}
                    </span>
                  ) : null}
                </span>
                {t.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
