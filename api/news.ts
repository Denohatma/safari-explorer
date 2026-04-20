import type { VercelRequest, VercelResponse } from '@vercel/node'
import Parser from 'rss-parser'

interface NewsArticle {
  date: string
  country: string
  headline: string
  category: string
  source: string
  url: string
}

const AFRICA_COUNTRIES = [
  'Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cameroon','Cape Verde',
  'Central African Republic','Chad','Comoros','Congo','Côte d\'Ivoire','DR Congo','Djibouti',
  'Egypt','Equatorial Guinea','Eritrea','Eswatini','Ethiopia','Gabon','Gambia','Ghana',
  'Guinea','Guinea-Bissau','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali',
  'Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda',
  'São Tomé','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan',
  'Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe',
  'Ivory Coast','DRC','Cabo Verde',
  // Cities that identify countries
  'Lagos','Nairobi','Johannesburg','Cairo','Casablanca','Accra','Addis Ababa','Kigali',
  'Dar es Salaam','Mombasa','Cape Town','Durban','Abuja','Kampala','Lusaka','Harare',
  'Maputo','Dakar','Abidjan','Tunis','Algiers','Kinshasa','Douala','Luanda',
]

const CITY_TO_COUNTRY: Record<string, string> = {
  Lagos: 'Nigeria', Abuja: 'Nigeria', Nairobi: 'Kenya', Mombasa: 'Kenya',
  Johannesburg: 'South Africa', 'Cape Town': 'South Africa', Durban: 'South Africa',
  Cairo: 'Egypt', Casablanca: 'Morocco', Accra: 'Ghana', 'Addis Ababa': 'Ethiopia',
  Kigali: 'Rwanda', 'Dar es Salaam': 'Tanzania', Kampala: 'Uganda', Lusaka: 'Zambia',
  Harare: 'Zimbabwe', Maputo: 'Mozambique', Dakar: 'Senegal', Abidjan: 'Côte d\'Ivoire',
  Tunis: 'Tunisia', Algiers: 'Algeria', Kinshasa: 'DR Congo', Douala: 'Cameroon',
  Luanda: 'Angola',
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Investment: ['invest', 'fund', 'capital', 'billion', 'million', 'raise', 'financing', 'venture', 'acquisition', 'acquire', 'buy', 'stake'],
  Policy: ['policy', 'regulation', 'government', 'minister', 'law', 'legislation', 'approve', 'license', 'regulatory', 'tax', 'incentive'],
  Infrastructure: ['data cent', 'datacent', 'facility', 'campus', 'build', 'construct', 'MW', 'megawatt', 'power', 'energy', 'grid', 'cable', 'submarine', 'fibre', 'fiber'],
  Expansion: ['expand', 'growth', 'new market', 'launch', 'open', 'enter', 'scale'],
  Partnership: ['partner', 'collaborat', 'joint venture', 'agreement', 'deal', 'MOU', 'alliance'],
  Sustainability: ['green', 'renewable', 'solar', 'wind', 'sustain', 'carbon', 'climate', 'ESG', 'net zero'],
}

const RSS_FEEDS = [
  { url: 'https://news.google.com/rss/search?q=%22data+centre%22+africa&hl=en&gl=US&ceid=US:en', source: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=%22data+center%22+africa&hl=en&gl=US&ceid=US:en', source: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=datacenter+africa+investment&hl=en&gl=US&ceid=US:en', source: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=%22data+centre%22+Nigeria+OR+Kenya+OR+%22South+Africa%22+OR+Egypt+OR+Morocco&hl=en&gl=US&ceid=US:en', source: 'Google News' },
]

function detectCountry(text: string): string {
  for (const [city, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (text.includes(city)) return country
  }
  for (const c of AFRICA_COUNTRIES) {
    if (text.includes(c)) return c
  }
  return 'Africa'
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase()
  let bestCat = 'Infrastructure'
  let bestScore = 0
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter(kw => lower.includes(kw)).length
    if (score > bestScore) { bestScore = score; bestCat = cat }
  }
  return bestCat
}

function extractSource(item: { creator?: string; link?: string; content?: string }): string {
  if (item.creator) return item.creator
  if (item.link) {
    try {
      const host = new URL(item.link).hostname.replace('www.', '')
      return host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1)
    } catch { /* ignore */ }
  }
  return 'Unknown'
}

// In-memory cache
let cachedArticles: NewsArticle[] = []
let cacheTimestamp = 0
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=43200') // CDN cache: 6h, stale: 12h

  if (Date.now() - cacheTimestamp < CACHE_TTL && cachedArticles.length > 0) {
    return res.status(200).json({ articles: cachedArticles, cached: true, fetchedAt: new Date(cacheTimestamp).toISOString() })
  }

  try {
    const parser = new Parser({ timeout: 10000 })
    const seen = new Set<string>()
    const articles: NewsArticle[] = []

    const feedResults = await Promise.allSettled(
      RSS_FEEDS.map(feed => parser.parseURL(feed.url))
    )

    for (const result of feedResults) {
      if (result.status !== 'fulfilled') continue
      const feed = result.value

      for (const item of feed.items ?? []) {
        const headline = item.title?.trim()
        if (!headline) continue

        // Deduplicate by headline similarity
        const key = headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
        if (seen.has(key)) continue
        seen.add(key)

        const fullText = `${headline} ${item.contentSnippet ?? ''}`
        const country = detectCountry(fullText)
        const category = detectCategory(fullText)
        const source = extractSource(item as { creator?: string; link?: string; content?: string })

        const date = item.isoDate
          ? new Date(item.isoDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)

        articles.push({
          date,
          country,
          headline,
          category,
          source,
          url: item.link ?? '',
        })
      }
    }

    // Sort by date descending, limit to 100 most recent
    articles.sort((a, b) => b.date.localeCompare(a.date))
    const limited = articles.slice(0, 100)

    cachedArticles = limited
    cacheTimestamp = Date.now()

    return res.status(200).json({ articles: limited, cached: false, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('News fetch error:', err)
    return res.status(500).json({ error: 'Failed to fetch news', articles: cachedArticles })
  }
}
