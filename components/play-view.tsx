'use client'

import { useState } from 'react'
import { Trophy, Target, FlaskConical, Bell, BellRing, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/primitives'
import { cn } from '@/lib/utils'

type ModeKey = 'tournaments' | 'predictions' | 'sandbox'

const MODES: {
  key: ModeKey
  icon: typeof Trophy
  title: string
  tagline: string
  description: string
  points: string[]
}[] = [
  {
    key: 'tournaments',
    icon: Trophy,
    title: 'Tournaments',
    tagline: 'Compete on collection performance',
    description:
      'Enter timed portfolio contests against other collectors. Build a bracket, track live standings, and climb the leaderboard on real market moves.',
    points: ['Timed portfolio contests', 'Live leaderboards', 'Head-to-head brackets'],
  },
  {
    key: 'predictions',
    icon: Target,
    title: 'Predictions',
    tagline: 'Call the market before it moves',
    description:
      'Forecast price direction on singles, sealed product, and sets. Build a track record and see how your calls stack up against the community.',
    points: ['Price direction calls', 'Accuracy track record', 'Community consensus'],
  },
  {
    key: 'sandbox',
    icon: FlaskConical,
    title: 'Sandbox',
    tagline: 'Practice with a paper portfolio',
    description:
      'Test strategies with a risk-free paper portfolio using live market data. Simulate trades before committing real capital.',
    points: ['Paper trading', 'Live market data', 'Zero risk experiments'],
  },
]

export function PlayView() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Coming soon
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
          Play
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty">
          Tournaments, predictions, and a paper-trading sandbox — new ways to test your instincts beyond
          just holding.
        </p>
      </div>

      {/* Modes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map((mode) => (
          <ModeCard key={mode.key} mode={mode} />
        ))}
      </div>
    </div>
  )
}

function ModeCard({ mode }: { mode: (typeof MODES)[number] }) {
  const [notified, setNotified] = useState(false)
  const Icon = mode.icon
  return (
    <Panel className="flex flex-col">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
        <Icon className="size-5" strokeWidth={2.2} />
      </span>
      <h2 className="mt-3 text-base font-semibold text-foreground">{mode.title}</h2>
      <p className="mt-0.5 text-sm font-medium text-primary">{mode.tagline}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">
        {mode.description}
      </p>
      <ul className="mt-4 space-y-1.5">
        {mode.points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3.5 shrink-0 text-muted-foreground/60" strokeWidth={2.4} />
            {p}
          </li>
        ))}
      </ul>
      <Button
        variant={notified ? 'secondary' : 'outline'}
        size="sm"
        onClick={() => setNotified((v) => !v)}
        className={cn(
          'mt-5 w-full gap-1.5 rounded-xl font-semibold',
          notified && 'text-positive',
        )}
      >
        {notified ? (
          <>
            <BellRing className="size-4" strokeWidth={2.4} />
            We&apos;ll notify you
          </>
        ) : (
          <>
            <Bell className="size-4" strokeWidth={2.4} />
            Notify me
          </>
        )}
      </Button>
    </Panel>
  )
}
