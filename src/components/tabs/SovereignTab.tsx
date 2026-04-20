import { useState, useMemo } from 'react'
import { DataTable } from '../Tables/DataTable'
import { StatCard } from '../StatCard'
import { scoreColor } from '../../utils/colors'
import { createColumnHelper } from '@tanstack/react-table'
import type { SovereignCountry } from '../../types'

import sovereignData from '../../data/sovereign-ai-demand.json'

const sovereignMeta = sovereignData as { metadata: Record<string, unknown>; countries: SovereignCountry[] }
const sovereignCountries = sovereignMeta.countries
const africaCtx = (sovereignMeta.metadata as Record<string, unknown>).africaMarketContext as Record<string, unknown> | undefined

interface SovRow {
  rank: number; name: string; iso3: string; tier: number; sovereignMW: number; totalDemandMW: number
  policyReadiness: number; canHost: boolean; hostType: string; sharingPartner: string
  regionalBloc: string; hasStrategy: boolean; capexM: number; internetPct: number; gdpB: number
}

const sovCol = createColumnHelper<SovRow>()
const TIER_COLORS: Record<number, string> = { 1: '#228B22', 2: '#eab308', 3: '#f97316', 4: '#ef4444' }
const MVS_OPTIONS = [20, 30, 40, 50]

export function SovereignTab() {
  const [mvsThreshold, setMvsThreshold] = useState(20)

  const sovRows = useMemo(() => {
    return sovereignCountries
      .map(c => {
        const canHost = c.estimatedSovereignDemandMW >= mvsThreshold
        return {
          rank: 0, name: c.name, iso3: c.iso3, tier: c.tier,
          sovereignMW: c.estimatedSovereignDemandMW, totalDemandMW: c.estimatedTotalDemandMW,
          policyReadiness: c.policyReadiness, canHost,
          hostType: canHost ? 'Individual' : 'Shared',
          sharingPartner: canHost ? '—' : (c.sharingPartnerHub ?? '—'),
          regionalBloc: c.regionalBlocs.join(', '), hasStrategy: c.hasAIDigitalStrategy,
          capexM: c.approxCapexMillionUSD, internetPct: c.internetPenetrationPct, gdpB: c.gdpBillionUSD,
        } satisfies SovRow
      })
      .sort((a, b) => b.sovereignMW - a.sovereignMW)
      .map((r, idx) => ({ ...r, rank: idx + 1 }))
  }, [mvsThreshold])

  const sovStats = useMemo(() => {
    const totalDemand = sovRows.reduce((s, r) => s + r.sovereignMW, 0)
    const canHostCount = sovRows.filter(r => r.canHost).length
    const needShareCount = sovRows.filter(r => !r.canHost).length
    const totalCapex = sovRows.reduce((s, r) => s + r.capexM, 0)
    const committedApprox = sovRows.filter(r => r.canHost).reduce((s, r) => s + Math.round(r.capexM * 0.35), 0)
    const needTA = sovRows.filter(r => r.policyReadiness < 3).length
    const uniqueHubs = new Set(sovRows.filter(r => !r.canHost).map(r => r.sharingPartner)).size
    return { totalDemand, assessed: sovRows.length, canHostCount, needShareCount, totalDCs: canHostCount + uniqueHubs, totalCapex, committedApprox, gap: totalCapex - committedApprox, needTA }
  }, [sovRows])

  const sovereignColumns = useMemo(() => [
    sovCol.accessor('rank', { header: '#', cell: i => <span className="text-gray-400">{i.getValue()}</span> }),
    sovCol.accessor('name', { header: 'Country', cell: i => <span className="font-medium">{i.getValue()}</span> }),
    sovCol.accessor('sovereignMW', { header: 'Sovereign MW', cell: i => <span className="font-bold">{i.getValue()} MW</span> }),
    sovCol.accessor('totalDemandMW', { header: 'Total MW', cell: i => `${i.getValue()} MW` }),
    sovCol.accessor('policyReadiness', {
      header: 'Readiness',
      cell: i => { const v = i.getValue(); return <span className="font-bold" style={{ color: scoreColor(v) }}>{v.toFixed(1)}</span> },
    }),
    sovCol.accessor('hostType', {
      header: 'Host Type',
      cell: i => i.getValue() === 'Individual'
        ? <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-green-600">Individual</span>
        : <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-amber-500">Shared</span>,
    }),
    sovCol.accessor('sharingPartner', { header: 'Sharing Hub' }),
    sovCol.accessor('regionalBloc', { header: 'Regional Bloc' }),
    sovCol.accessor('hasStrategy', { header: 'AI Strategy', cell: i => i.getValue() ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400">No</span> }),
    sovCol.accessor('capexM', { header: 'CapEx $M', cell: i => `$${i.getValue().toLocaleString()}` }),
    sovCol.accessor('internetPct', { header: 'Internet %', cell: i => `${i.getValue()}%` }),
    sovCol.accessor('tier', {
      header: 'Tier',
      cell: i => <span className="font-medium" style={{ color: TIER_COLORS[i.getValue()] ?? '#6b7280' }}>T{i.getValue()}</span>,
    }),
  ], [mvsThreshold])

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 bg-gray-50/80 px-3 py-2 flex flex-wrap gap-2 items-center border-b border-gray-200">
        <StatCard label="Total Sovereign Demand" value={`${sovStats.totalDemand.toLocaleString()} MW`} accent="border-l-safari-green-dark" />
        <StatCard label="Countries Assessed" value={sovStats.assessed} accent="border-l-safari-green-mid" />
        <StatCard label="Can Host Individually" value={sovStats.canHostCount} accent="border-l-green-600" textClass="text-green-700" />
        <StatCard label="Need Shared Hosting" value={sovStats.needShareCount} accent="border-l-amber-500" textClass="text-amber-600" />
        <StatCard label="Sovereign DCs" value={sovStats.totalDCs} accent="border-l-safari-blue" />
        <StatCard label="Total CapEx" value={`$${(sovStats.totalCapex / 1000).toFixed(1)}B`} accent="border-l-safari-orange" />
        <StatCard label="Committed" value={`$${(sovStats.committedApprox / 1000).toFixed(1)}B`} accent="border-l-committed" />
        <StatCard label="Capital Gap" value={`$${(sovStats.gap / 1000).toFixed(1)}B`} accent="border-l-red-500" textClass="text-red-600" />
        <StatCard label="Need Policy TA" value={sovStats.needTA} accent="border-l-purple-500" textClass="text-purple-700" />
      </div>
      {africaCtx && (
        <div className="shrink-0 bg-white/80 px-3 py-1.5 flex flex-wrap gap-2 items-center border-b border-gray-100 text-[10px]">
          <span className="font-semibold text-gray-600 uppercase tracking-wider mr-1">Global Context:</span>
          <span className="bg-purple-50 rounded px-2 py-0.5">Data protection laws: <strong className="text-purple-700">{String(africaCtx.countriesWithDataProtection)}+ countries</strong></span>
          <span className="bg-purple-50 rounded px-2 py-0.5">Malabo Convention: <strong className="text-purple-700">{String(africaCtx.countriesRatifiedMalabo)} ratified</strong></span>
          <span className="bg-purple-50 rounded px-2 py-0.5">National AI strategies: <strong className="text-purple-700">{String(africaCtx.countriesWithAIStrategy)} countries</strong></span>
          <span className="bg-purple-50 rounded px-2 py-0.5">Installed capacity: <strong className="text-safari-green-dark">{String((africaCtx.installedCapacityMW2025 as Record<string, number>)?.total)} MW</strong> (Active: {String((africaCtx.installedCapacityMW2025 as Record<string, number>)?.active)}, UC: {String((africaCtx.installedCapacityMW2025 as Record<string, number>)?.underConstruction)}, Pipeline: {String((africaCtx.installedCapacityMW2025 as Record<string, number>)?.pipeline)})</span>
        </div>
      )}
      <div className="shrink-0 bg-white px-4 py-2 border-b border-gray-200 flex items-center gap-4">
        <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">Min Viable Sovereign DC:</span>
        <div className="flex gap-1">
          {MVS_OPTIONS.map(v => (
            <button key={v} onClick={() => setMvsThreshold(v)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mvsThreshold === v ? 'bg-safari-green text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >{v} MW</button>
          ))}
        </div>
        <span className="text-[10px] text-gray-400 ml-2">Countries with &lt;{mvsThreshold} MW must share</span>
      </div>
      <div className="flex-1 min-h-0 bg-white overflow-hidden">
        <DataTable data={sovRows} columns={sovereignColumns} searchPlaceholder="Search all 54 African countries..." compact showColumnFilters />
      </div>
    </div>
  )
}
