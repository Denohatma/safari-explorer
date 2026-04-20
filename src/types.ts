export interface Facility {
  id: string
  name: string
  country: string
  countryCode: string
  city: string
  lat: number
  lng: number
  operator: string
  status: 'Existing' | 'Under Construction' | 'Planned' | 'Potential'
  type: string
  mwCapacity: number
  capex: number
  committed: number
  scores: Record<string, number>
  wlcScore: number
  tier: number
}

export interface D5Detail {
  score: number
  label: string
}

export interface Country {
  name: string
  code: string
  gdp: number
  dmFactor: number
  internetPct: number
  sadmWeight: number
  totalDemandMW: number
  sovereignMW: number
  commercialMW: number
  electricityTariff: number
  annualOpex: number
  meetsMVS: boolean
  recDCs: number
  sharingHub: string | null
  d5Score: number
  d12Score: number
  policyReadiness: number
  d5Details: Record<string, D5Detail>
  d12Details: string
  dmRationale: string
  dimensionScores: Record<string, number>
  avgDimensionScore: number
}

export interface NewsArticle {
  date: string
  country: string
  headline: string
  category: string
  source: string
  url: string
}

export interface SovereignCountry {
  name: string
  iso3: string
  tier: number
  estimatedTotalDemandMW: number
  estimatedSovereignDemandMW: number
  estimatedCommercialDemandMW: number
  canIndependentlyHost: boolean
  sharingPartnerHub: string | null
  regionalBlocs: string[]
  hasAIDigitalStrategy: boolean
  policyReadiness: number
  d5Score: number
  internetPenetrationPct: number
  gdpBillionUSD: number
  electricityTariffUSDkWh: number
  approxCapexMillionUSD: number
  annualOpexMillionUSD: number
  recommendedDCs: number
  dmRationale: string
}

export interface HubLink {
  from: string
  fromName: string
  to: string
  toName: string
  hub: string
}

export type TabId = 'infrastructure' | 'sovereign' | 'enabling' | 'intelligence' | 'contact'

export interface DCEvent {
  id: string
  name: string
  subtitle: string
  date: string
  endDate: string
  location: string
  type: string
  description: string
  relevance: string
  url: string
  status: 'upcoming' | 'past'
}

export interface TopMarket {
  country: string
  code: string
  facilities: number | null
  marketValueM: number
  capacityMW: number | null
  growthNote: string
}

export interface KeyDriverRisk {
  driver?: string
  risk?: string
  detail: string
}

export const DIMENSION_LABELS: Record<string, string> = {
  D1: 'Power & Energy',
  D2: 'Connectivity',
  D3: 'Land & Site',
  D4: 'Climate & Cooling',
  D5: 'Regulatory',
  D6: 'Market Demand',
  D7: 'Workforce',
  D8: 'Logistics',
  D9: 'Sustainability',
  D10: 'Facility Tier',
  D11: 'Africa-Specific',
  D12: 'Security',
}
