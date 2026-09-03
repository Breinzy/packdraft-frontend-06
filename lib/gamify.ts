// Lightweight collector-progression system. Turns portfolio activity into a
// tiered "collector rank" so the product feels like a game you level up in,
// not a spreadsheet. Tiers are themed after TCG player progression.

export interface Tier {
  name: string
  min: number
}

export const TIERS: Tier[] = [
  { name: 'Rookie', min: 0 },
  { name: 'Collector', min: 2500 },
  { name: 'Trainer', min: 5000 },
  { name: 'Ace Trainer', min: 8000 },
  { name: 'Elite', min: 15000 },
  { name: 'Champion', min: 30000 },
  { name: 'Master', min: 60000 },
]

export interface TierProgress {
  current: Tier
  next: Tier | null
  index: number
  /** 0..1 progress through the current band toward the next tier */
  progress: number
  /** dollars still needed to reach the next tier */
  toNext: number
}

export function getTier(value: number): TierProgress {
  let index = 0
  for (let i = 0; i < TIERS.length; i++) {
    if (value >= TIERS[i].min) index = i
  }
  const current = TIERS[index]
  const next = TIERS[index + 1] ?? null
  const progress = next ? Math.min(1, Math.max(0, (value - current.min) / (next.min - current.min))) : 1
  return { current, next, index, progress, toNext: next ? Math.max(0, next.min - value) : 0 }
}

/**
 * A single composite "collector score" combining portfolio scale, breadth of
 * the collection, and engagement streak. Deterministic so SSR/CSR agree.
 */
export function collectorScore(input: { value: number; positions: number; setsTracked: number; streak: number }) {
  return Math.round(input.value / 50 + input.positions * 40 + input.setsTracked * 60 + input.streak * 25)
}

/** Deterministic daily engagement streak (mock, stable across renders). */
export function dayStreak(seed: number) {
  return 8 + (seed * 7) % 22
}
