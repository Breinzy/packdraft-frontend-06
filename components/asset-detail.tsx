'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Plus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAsset, relatedAssets, getSet, type GradeQuote } from '@/lib/data'
import { usePortfolio } from '@/lib/store'
import { useUI } from '@/lib/ui'
import { PriceChart } from '@/components/charts'
import { WatchButton, AssetRow } from '@/components/asset-views'
import { AssetHero, ChangeBadge, Panel, SectionHead, TypePill } from '@/components/primitives'
import { formatUSD, formatSignedUSD, formatPct, formatDate, formatCompactNumber, trendClass } from '@/lib/format'
import { cn } from '@/lib/utils'

export function AssetDetail({ assetId }: { assetId: string }) {
  const asset = getAsset(assetId)
  const { openAdd } = useUI()
  const { ownedFor, totals } = usePortfolio()
  const [grade, setGrade] = useState<GradeQuote['grade']>('raw')

  if (!asset) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground">Asset not found.</p>
        <Link href="/market" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Back to market
        </Link>
      </div>
    )
  }

  const set = getSet(asset.setId)
  const related = relatedAssets(asset)
  const owned = ownedFor(asset.id)
  const activeGrade = asset.grades?.find((g) => g.grade === grade)
  const shownPrice = activeGrade?.price ?? asset.price
  // raw grade carries no independent change; fall back to the asset's 24h move
  const shownChange =
    activeGrade && grade !== 'raw' && activeGrade.change !== 0 ? activeGrade.change : asset.change24h
  const exposure = totals.value > 0 && owned ? (owned.marketValue / totals.value) * 100 : 0

  const history = useMemo(() => {
    if (!activeGrade || grade === 'raw') return asset.history
    const mult = activeGrade.price / asset.price
    return asset.history.map((v) => Number((v * mult).toFixed(2)))
  }, [asset.history, activeGrade, grade, asset.price])

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/market"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Market
        </Link>
        <WatchButton assetId={asset.id} />
      </div>

      {/* AT A GLANCE: image · price · chart */}
      <div className="grid gap-5 lg:grid-cols-[minmax(280px,340px)_1fr] lg:items-start">
        {/* Card hero */}
        <AssetHero
          asset={asset}
          className="rounded-2xl border border-border bg-card lg:sticky lg:top-5"
        />

        <div className="flex flex-col gap-4">
          {/* Identity + price */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <TypePill type={asset.type} />
                <Link
                  href={`/sets/${asset.setId}`}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {asset.setName}
                </Link>
              </div>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
                {asset.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {asset.subtitle} · {asset.tag}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="tabular text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {formatUSD(shownPrice, { cents: true })}
              </p>
              <div className="mt-1 flex justify-end">
                <ChangeBadge value={shownChange} size="md" />
              </div>
            </div>
          </div>

          {/* Grade segmented control */}
          {asset.grades && (
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-secondary/50 p-1">
              {asset.grades.map((g) => {
                const sel = grade === g.grade
                return (
                  <button
                    key={g.grade}
                    onClick={() => setGrade(g.grade)}
                    className={cn(
                      'rounded-lg px-1 py-1.5 text-center transition-colors',
                      sel ? 'bg-card-elevated shadow-sm' : 'hover:bg-card/60',
                    )}
                  >
                    <span
                      className={cn(
                        'block text-[10px] font-bold uppercase tracking-wide',
                        sel ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {g.grade === 'raw' ? 'Raw' : g.grade.toUpperCase().replace('PSA', 'PSA ')}
                    </span>
                    <span
                      className={cn(
                        'tabular mt-0.5 block text-xs font-semibold',
                        sel ? 'text-foreground' : 'text-muted-foreground/70',
                      )}
                    >
                      {formatUSD(g.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Chart */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <PriceChart history={history} defaultRange="3M" height={200} />
          </div>

          {/* Primary action */}
          <Button
            onClick={() => openAdd(asset.id)}
            size="lg"
            className="h-12 w-full gap-1.5 rounded-xl font-semibold"
          >
            <Plus className="size-4" strokeWidth={2.5} /> Add to collection
          </Button>
        </div>
      </div>

      {/* Your position (if owned) */}
      {owned && (
        <Panel className="border-primary/25 bg-primary-muted/30">
          <SectionHead title="Your position" action="Portfolio" href="/portfolio" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <PosStat label="Quantity" value={String(owned.quantity)} />
            <PosStat label="Avg cost" value={formatUSD(owned.costBasisPerUnit, { cents: true })} />
            <PosStat label="Cost basis" value={formatUSD(owned.costBasis)} />
            <PosStat label="Market value" value={formatUSD(owned.marketValue)} />
            <PosStat
              label="Unrealized"
              value={formatSignedUSD(owned.gain)}
              valueClass={trendClass(owned.gain)}
              sub={formatPct(owned.returnPct)}
            />
            <PosStat label="Exposure" value={`${exposure.toFixed(1)}%`} />
          </div>
        </Panel>
      )}

      {/* Market stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricTile label="24h change" value={formatPct(asset.change24h)} valueClass={trendClass(asset.change24h)} />
        <MetricTile label="7d change" value={formatPct(asset.change7d)} valueClass={trendClass(asset.change7d)} />
        <MetricTile label="30d change" value={formatPct(asset.change30d)} valueClass={trendClass(asset.change30d)} />
        <MetricTile label="Volume" value={formatCompactNumber(asset.volume)} />
        <MetricTile label="Watchers" value={formatCompactNumber(asset.watchers)} />
        <MetricTile label="Released" value={formatDate(asset.releasedAt)} />
      </div>

      {/* Related + set */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionHead title={asset.type === 'card' ? 'Related cards & variants' : 'Related products'} />
          <div className="-mx-1">
            {related.map((a) => (
              <AssetRow key={a.id} asset={a} />
            ))}
          </div>
        </Panel>

        {set && (
          <Panel>
            <SectionHead title="From this set" />
            <Link
              href={`/sets/${set.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-border-strong"
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-black text-background"
                style={{ background: set.logoColor }}
              >
                {set.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{set.name}</p>
                <p className="text-xs text-muted-foreground">{set.cardCount} cards · {formatDate(set.releasedAt)}</p>
              </div>
            </Link>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/50 p-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="size-4" /> Set index
              </span>
              <div className="text-right">
                <span className="tabular text-sm font-semibold text-foreground">{formatUSD(set.price)}</span>
                <div className="flex justify-end">
                  <ChangeBadge value={set.change30d} size="sm" showIcon={false} />
                </div>
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}

function PosStat({ label, value, valueClass, sub }: { label: string; value: string; valueClass?: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn('tabular mt-0.5 text-base font-bold text-foreground', valueClass)}>{value}</p>
      {sub && <p className={cn('tabular text-xs font-semibold', valueClass)}>{sub}</p>}
    </div>
  )
}

function MetricTile({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <Panel className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn('tabular text-lg font-bold text-foreground', valueClass)}>{value}</span>
    </Panel>
  )
}
