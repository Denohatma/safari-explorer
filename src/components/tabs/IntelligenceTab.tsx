import { useState, useEffect } from 'react'
import { DataTable } from '../Tables/DataTable'
import type { NewsArticle, DCEvent, TopMarket, KeyDriverRisk } from '../../types'
import { createColumnHelper } from '@tanstack/react-table'

import newsArticles from '../../data/africa-dc-news.json'
import eventsData from '../../data/africa-dc-events.json'

const staticNewsData = (newsArticles as NewsArticle[]).sort((a, b) => b.date.localeCompare(a.date))
const sectorOutlook = eventsData.sectorOutlook
const dcEvents = (eventsData.events as DCEvent[]).sort((a, b) => a.date.localeCompare(b.date))
const topMarkets = sectorOutlook.topMarkets as TopMarket[]
const keyDrivers = sectorOutlook.keyDrivers as KeyDriverRisk[]
const keyRisks = sectorOutlook.keyRisks as KeyDriverRisk[]

const NEWS_CATEGORY_COLORS: Record<string, string> = {
  Investment: '#228B22', Policy: '#00BFFF', Infrastructure: '#FF7F50',
  Expansion: '#63b32e', Partnership: '#006811', Sustainability: '#00943c',
}

const newsCol = createColumnHelper<NewsArticle>()
const newsColumns = [
  newsCol.accessor('date', { header: 'Date', cell: i => <span className="text-gray-500 whitespace-nowrap">{i.getValue()}</span> }),
  newsCol.accessor('country', { header: 'Country' }),
  newsCol.accessor('headline', {
    header: 'Headline',
    cell: i => {
      const row = i.row.original
      return (
        <a href={row.url} target="_blank" rel="noopener noreferrer" className="font-medium text-safari-dark hover:text-safari-green underline-offset-2 hover:underline">
          {i.getValue()}
        </a>
      )
    },
  }),
  newsCol.accessor('category', {
    header: 'Category',
    cell: i => (
      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-white whitespace-nowrap" style={{ backgroundColor: NEWS_CATEGORY_COLORS[i.getValue()] ?? '#6b7280' }}>
        {i.getValue()}
      </span>
    ),
  }),
  newsCol.accessor('source', { header: 'Source', cell: i => <span className="text-[10px] text-safari-blue">{i.getValue()}</span> }),
  newsCol.accessor('url', {
    header: 'Link',
    cell: i => (
      <a href={i.getValue()} target="_blank" rel="noopener noreferrer" className="text-safari-blue hover:underline text-[10px]">
        Open ↗
      </a>
    ),
  }),
]

export function IntelligenceTab() {
  const [liveNews, setLiveNews] = useState<NewsArticle[] | null>(null)
  const [newsFetchedAt, setNewsFetchedAt] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        if (data.articles?.length > 0) {
          setLiveNews(data.articles)
          setNewsFetchedAt(data.fetchedAt ?? null)
        }
      })
      .catch(() => {})
  }, [])

  const newsData = liveNews ?? staticNewsData

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 bg-gray-50/80 px-3 py-1.5 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span className={`inline-block w-2 h-2 rounded-full ${liveNews ? 'bg-green-500' : 'bg-gray-300'}`} />
          {liveNews ? 'Live feed' : 'Static data'} — {newsData.length} articles
          {newsFetchedAt && <span>· Updated {new Date(newsFetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span>Sources: ADCA, McKinsey, Wesgro, DCD, TechCabal</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Sector Summary + Events */}
        <div className="w-[420px] shrink-0 border-r border-gray-200 flex flex-col overflow-y-auto bg-gray-50/50">
          <SectorSummary />
          <EventsList />
        </div>

        {/* Right: News Feed */}
        <div className="flex-1 min-h-0 bg-white overflow-hidden flex flex-col">
          <div className="shrink-0 px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold font-[family-name:var(--font-title)] text-safari-dark flex items-center gap-2">
              <span className="w-1 h-4 bg-safari-orange rounded-full inline-block" />
              News Updates
            </h3>
            <span className="text-[10px] text-gray-400">{newsData.length} articles</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <DataTable data={newsData} columns={newsColumns} searchPlaceholder="Search news, countries, sources..." compact showColumnFilters dropdownFilterColumns={['category', 'country', 'source']} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectorSummary() {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-bold font-[family-name:var(--font-title)] text-safari-dark mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-safari-green rounded-full inline-block" />
        Sector Market Opportunity
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Africa DC Market</div>
          <div className="text-lg font-bold text-safari-dark leading-tight">${sectorOutlook.africaMarket.value2024Bn}B</div>
          <div className="text-[10px] text-safari-green-dark font-medium">&rarr; ${sectorOutlook.africaMarket.value2030Bn}B by 2030</div>
          <div className="text-[9px] text-gray-400">CAGR {sectorOutlook.africaMarket.cagrPct}%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Demand Growth</div>
          <div className="text-lg font-bold text-safari-dark leading-tight">3.5–5.5x</div>
          <div className="text-[10px] text-safari-blue font-medium">1.5–2.2 GW by 2030</div>
          <div className="text-[9px] text-gray-400">McKinsey projection</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Investment Needed</div>
          <div className="text-lg font-bold text-safari-orange leading-tight">${sectorOutlook.africaMarket.newInvestmentNeededBn}B</div>
          <div className="text-[10px] text-gray-500">Africa AI Fund: <strong className="text-purple-600">${sectorOutlook.africaMarket.africaAIFundBn}B</strong></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Global DC Market</div>
          <div className="text-lg font-bold text-gray-700 leading-tight">${sectorOutlook.globalMarket.value2025Bn}B</div>
          <div className="text-[10px] text-red-500 font-medium">Africa share: {sectorOutlook.africaMarket.globalSharePct}%</div>
          <div className="text-[9px] text-gray-400">${sectorOutlook.globalMarket.totalInvestment5YrTrn}T over 5 yrs</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm mb-3">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">Africa Installed Capacity (MW)</div>
        <div className="flex h-5 rounded-full overflow-hidden bg-gray-100">
          <div className="bg-safari-green flex items-center justify-center text-[8px] text-white font-bold" style={{ width: `${(sectorOutlook.africaMarket.activeCapacityMW / sectorOutlook.africaMarket.installedCapacityMW) * 100}%` }}>
            {sectorOutlook.africaMarket.activeCapacityMW}
          </div>
          <div className="bg-safari-blue flex items-center justify-center text-[8px] text-white font-bold" style={{ width: `${(sectorOutlook.africaMarket.underConstructionMW / sectorOutlook.africaMarket.installedCapacityMW) * 100}%` }}>
            {sectorOutlook.africaMarket.underConstructionMW}
          </div>
          <div className="bg-safari-orange flex items-center justify-center text-[8px] text-white font-bold" style={{ width: `${(sectorOutlook.africaMarket.pipelineMW / sectorOutlook.africaMarket.installedCapacityMW) * 100}%` }}>
            {sectorOutlook.africaMarket.pipelineMW}
          </div>
        </div>
        <div className="flex justify-between text-[8px] text-gray-400 mt-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-safari-green inline-block" /> Active</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-safari-blue inline-block" /> Under Construction</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-safari-orange inline-block" /> Pipeline</span>
          <span className="font-medium text-gray-600">Total: {sectorOutlook.africaMarket.installedCapacityMW} MW</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 overflow-hidden">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider px-2.5 pt-2 pb-1">Top Markets</div>
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="text-left px-2.5 py-1 font-medium">Country</th>
              <th className="text-right px-2.5 py-1 font-medium">DCs</th>
              <th className="text-right px-2.5 py-1 font-medium">Market $M</th>
              <th className="text-left px-2.5 py-1 font-medium">Outlook</th>
            </tr>
          </thead>
          <tbody>
            {topMarkets.map(m => (
              <tr key={m.code} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-2.5 py-1.5 font-medium text-safari-dark">{m.country}</td>
                <td className="px-2.5 py-1.5 text-right font-bold">{m.facilities ?? '—'}</td>
                <td className="px-2.5 py-1.5 text-right font-bold text-safari-green-dark">${m.marketValueM}</td>
                <td className="px-2.5 py-1.5 text-gray-500 leading-tight">{m.growthNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-green-700 uppercase tracking-wider font-bold mb-1.5">Key Growth Drivers</div>
          {keyDrivers.map((d, i) => (
            <div key={i} className="mb-1.5 last:mb-0">
              <div className="text-[10px] font-semibold text-safari-dark">{d.driver}</div>
              <div className="text-[9px] text-gray-500 leading-tight">{d.detail}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm">
          <div className="text-[9px] text-red-600 uppercase tracking-wider font-bold mb-1.5">Key Risks</div>
          {keyRisks.map((r, i) => (
            <div key={i} className="mb-1.5 last:mb-0">
              <div className="text-[10px] font-semibold text-safari-dark">{r.risk}</div>
              <div className="text-[9px] text-gray-500 leading-tight">{r.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EventsList() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-bold font-[family-name:var(--font-title)] text-safari-dark mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-safari-blue rounded-full inline-block" />
        Sector Events
      </h3>
      <div className="space-y-2">
        {dcEvents.map(ev => {
          const isUpcoming = ev.status === 'upcoming'
          const dateStr = new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          const endStr = ev.endDate !== ev.date ? new Date(ev.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null
          return (
            <a key={ev.id} href={ev.url} target="_blank" rel="noopener noreferrer"
              className={`block rounded-lg border p-3 transition-all hover:shadow-md ${isUpcoming ? 'bg-white border-safari-blue/30 hover:border-safari-blue' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <div className="text-[11px] font-semibold text-safari-dark leading-tight">{ev.name}</div>
                  <div className="text-[9px] text-gray-500">{ev.subtitle}</div>
                </div>
                <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isUpcoming ? 'bg-safari-blue/10 text-safari-blue' : 'bg-gray-200 text-gray-500'}`}>
                  {isUpcoming ? 'Upcoming' : 'Past'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-gray-500 mb-1">
                <span>{dateStr}{endStr ? ` – ${endStr}` : ''}</span>
                <span>{ev.location}</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[8px]">{ev.type}</span>
              </div>
              <div className="text-[9px] text-gray-600 leading-relaxed">{ev.description}</div>
              <div className="text-[9px] text-safari-green-dark mt-1 font-medium">Relevance: {ev.relevance}</div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
