import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { Asset, EnergyType } from '@/lib/data'
import { formatPct } from '@/lib/format'
import { cn } from '@/lib/utils'

/* ------------------------------ ChangeBadge ------------------------------ */

export function ChangeBadge({
  value,
  className,
  size = 'sm',
  showIcon = true,
}: {
  value: number
  className?: string
  size?: 'sm' | 'md'
  showIcon?: boolean
}) {
  const up = value > 0
  const flat = value === 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md font-semibold tabular',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm',
        flat
          ? 'bg-muted text-muted-foreground'
          : up
            ? 'bg-positive-muted text-positive'
            : 'bg-negative-muted text-negative',
        className,
      )}
    >
      {showIcon && !flat && <Icon className={size === 'sm' ? 'size-3' : 'size-3.5'} strokeWidth={2.5} />}
      {formatPct(value)}
    </span>
  )
}

/* ------------------------------- AssetToken ------------------------------- */

const ENERGY_COLOR: Record<EnergyType, string> = {
  lightning: 'oklch(0.82 0.14 78)',
  psychic: 'oklch(0.7 0.15 300)',
  fire: 'oklch(0.68 0.19 30)',
  water: 'oklch(0.62 0.187 254)',
  grass: 'oklch(0.74 0.16 158)',
  darkness: 'oklch(0.5 0.05 264)',
  dragon: 'oklch(0.72 0.13 200)',
  colorless: 'oklch(0.7 0.02 264)',
}

const sizeMap = {
  sm: 'size-10 text-sm rounded-lg',
  md: 'size-14 text-base rounded-xl',
  lg: 'size-20 text-2xl rounded-2xl',
  xl: 'h-full w-full text-5xl rounded-2xl',
}

function assetInitials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function AssetToken({
  asset,
  size = 'md',
  className,
}: {
  asset: Pick<Asset, 'name' | 'energy' | 'type'>
  size?: keyof typeof sizeMap
  className?: string
}) {
  const color = ENERGY_COLOR[asset.energy]
  const initials = assetInitials(asset.name)
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden border border-border-strong font-bold tracking-tight',
        sizeMap[size],
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 30% 0%, ${color.replace(')', ' / 0.28)')}, var(--card-elevated) 62%)`,
        color,
      }}
      aria-hidden
    >
      <span
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      {asset.type === 'sealed' ? (
        <span className="text-[0.7em] font-extrabold uppercase leading-none">{initials}</span>
      ) : (
        <span className="leading-none">{initials}</span>
      )}
      {asset.type === 'sealed' && (
        <span className="absolute bottom-1 rounded-sm bg-background/40 px-1 text-[8px] font-bold uppercase tracking-wider text-foreground/80">
          Sealed
        </span>
      )}
    </div>
  )
}

/* ---------- AssetHero: large centered card-shaped visual on a soft glow ---------- */

export function AssetHero({
  asset,
  className,
  children,
}: {
  asset: Pick<Asset, 'name' | 'energy' | 'type'>
  className?: string
  children?: React.ReactNode
}) {
  const color = ENERGY_COLOR[asset.energy]
  const initials = assetInitials(asset.name)
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden px-6 py-7',
        className,
      )}
    >
      {/* backdrop glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(58% 52% at 50% 38%, ${color.replace(')', ' / 0.3)')}, transparent 72%)`,
        }}
      />
      {/* card */}
      <div
        aria-hidden
        className="relative flex aspect-[5/7] w-[190px] max-w-[62%] items-center justify-center rounded-2xl border border-border-strong shadow-2xl sm:w-[210px] sm:max-w-none"
        style={{
          background: `radial-gradient(125% 120% at 30% 0%, ${color.replace(')', ' / 0.42)')}, var(--card-elevated) 60%)`,
          color,
        }}
      >
        <span
          className="absolute inset-x-0 top-0 h-px opacity-70"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
        <span
          className={cn(
            'font-bold leading-none tracking-tight',
            asset.type === 'sealed' ? 'text-3xl uppercase' : 'text-5xl',
          )}
        >
          {initials}
        </span>
        {asset.type === 'sealed' && (
          <span className="absolute bottom-3 rounded bg-background/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-foreground/80">
            Sealed
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

/* ------------------------------- TypePill ------------------------------- */

export function TypePill({ type }: { type: Asset['type'] | 'set' }) {
  const label = type === 'card' ? 'Card' : type === 'sealed' ? 'Sealed' : 'Set'
  const cls =
    type === 'card'
      ? 'text-primary bg-primary-muted'
      : type === 'sealed'
        ? 'text-warning bg-warning-muted'
        : 'text-chart-4 bg-[oklch(0.7_0.15_300_/_0.14)]'
  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', cls)}>
      {label}
    </span>
  )
}

/* ------------------------------ SectionHead ------------------------------ */

export function SectionHead({
  title,
  action,
  href,
  className,
}: {
  title: string
  action?: string
  href?: string
  className?: string
}) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-3', className)}>
      <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      {action &&
        (href ? (
          <Link href={href} className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
            {action}
          </Link>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">{action}</span>
        ))}
    </div>
  )
}

/* -------------------------------- Panel -------------------------------- */

export function Panel({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card',
        padded && 'p-4 sm:p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}
