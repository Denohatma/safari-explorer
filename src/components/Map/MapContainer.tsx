import { useEffect, useRef, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type { Facility, Country, HubLink } from '../../types'
import { STATUS_COLORS, demandColor, scoreColor } from '../../utils/colors'
import { generateHubArcs } from '../../utils/geo'
import { formatMW, formatCurrency, formatScore } from '../../utils/formatters'
// africa-boundaries.json (1.3 MB) loaded dynamically to keep initial bundle small
import type { TabId } from '../../types'

interface Props {
  tab: TabId
  facilities: Facility[]
  countries: Country[]
  hubLinks: HubLink[]
  choroplethMode?: string
  showGrid?: boolean
  showFibre?: boolean
  onCountryClick?: (country: Country) => void
  onFacilityClick?: (facility: Facility) => void
}

function buildFacilityFeatures(facilities: Facility[]): GeoJSON.Feature[] {
  return facilities.map(f => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
    properties: {
      id: f.id,
      name: f.name,
      mw: f.mwCapacity,
      color: STATUS_COLORS[f.status] ?? '#9ca3af',
      status: f.status,
    },
  }))
}

export function MapContainer({ tab, facilities, countries, hubLinks, choroplethMode = 'none', showGrid = false, showFibre = false, onCountryClick, onFacilityClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const boundariesRef = useRef<GeoJSON.FeatureCollection | null>(null)

  // Store latest props in refs so map callbacks can access them
  const facilitiesRef = useRef(facilities)
  facilitiesRef.current = facilities
  const onFacilityClickRef = useRef(onFacilityClick)
  onFacilityClickRef.current = onFacilityClick
  const onCountryClickRef = useRef(onCountryClick)
  onCountryClickRef.current = onCountryClick

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const el = containerRef.current
    const map = new maplibregl.Map({
      container: el,
      style: {
        version: 8,
        sources: {
          'carto': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '&copy; CARTO &copy; OSM',
          },
        },
        layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
      },
      center: [20, 5],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
    })

    const ro = new ResizeObserver(() => { map.resize() })
    ro.observe(el)
    const timer = setTimeout(() => { map.resize() }, 200)

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', async () => {
      const boundaries = (await import('../../data/africa-boundaries.json')).default as GeoJSON.FeatureCollection
      boundariesRef.current = boundaries
      map.addSource('africa', {
        type: 'geojson',
        data: boundaries,
      })
      map.addLayer({
        id: 'africa-fill',
        type: 'fill',
        source: 'africa',
        paint: { 'fill-color': 'transparent', 'fill-opacity': 0.5 },
      })
      map.addLayer({
        id: 'africa-border',
        type: 'line',
        source: 'africa',
        paint: { 'line-color': '#999', 'line-width': 0.5 },
      })

      // Electricity grid overlay
      map.addSource('electricity-grid', {
        type: 'vector',
        tiles: ['https://energydata-tiles-bk.s3.amazonaws.com/tiles/6f94ed68-f5c2-4a75-aa91-14bcc0633a01-2288710f-3e12-4b69-b2da-0bfc9ac088fa/{z}/{x}/{y}.pbf'],
        minzoom: 2,
        maxzoom: 10,
      })
      map.addLayer({
        id: 'electricity-grid-layer',
        type: 'line',
        source: 'electricity-grid',
        'source-layer': 'data_layer',
        paint: {
          'line-color': '#f59e0b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 6, 1.5, 10, 2.5],
          'line-opacity': 0.6,
        },
        layout: { 'visibility': 'none' },
      })

      // Fibre optic overlay
      map.addSource('fibre-network', {
        type: 'vector',
        tiles: ['https://d316kar6yg8hyq.cloudfront.net/africa-fiber/{z}/{x}/{y}.mvt'],
        minzoom: 2,
        maxzoom: 14,
      })
      map.addLayer({
        id: 'fibre-network-layer',
        type: 'line',
        source: 'fibre-network',
        'source-layer': 'fiber',
        paint: {
          'line-color': '#8b5cf6',
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.8, 6, 1.5, 10, 2.5],
          'line-opacity': 0.7,
        },
        layout: { 'visibility': 'none' },
      })

      // Hub links
      map.addSource('hub-links', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })
      map.addLayer({
        id: 'hub-links-layer',
        type: 'line',
        source: 'hub-links',
        paint: {
          'line-color': '#00BFFF',
          'line-width': 0.8,
          'line-dasharray': [4, 4],
          'line-opacity': 0.5,
        },
      })

      // Facility markers — populate immediately with current data
      map.addSource('facilities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: buildFacilityFeatures(facilitiesRef.current),
        },
      })
      map.addLayer({
        id: 'facilities-layer',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'mw'], 5, 6, 50, 10, 500, 18],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-opacity': 0.85,
        },
      })

      // Click: open detail popup
      map.on('click', 'facilities-layer', (e) => {
        if (!e.features?.[0]) return
        const props = e.features[0].properties
        if (!props) return
        const fac = facilitiesRef.current.find(f => f.id === props.id)
        if (!fac) return

        const gap = fac.capex - fac.committed
        const statusColor = STATUS_COLORS[fac.status] ?? '#9ca3af'
        const html = `
          <div style="padding:12px 14px;font-size:12px;line-height:1.5;min-width:240px">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#0a2e14">${fac.name}</div>
            <div style="margin-bottom:8px;color:#6b7280">${fac.operator} — ${fac.city}, ${fac.country}</div>
            <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
              <span style="background:${statusColor};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${fac.status}</span>
              <span style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:11px">Tier ${fac.tier}</span>
              <span style="background:#f3f4f6;padding:2px 8px;border-radius:4px;font-size:11px">WLC: ${formatScore(fac.wlcScore)}</span>
            </div>
            <table style="width:100%;font-size:11px;border-collapse:collapse">
              <tr><td style="color:#6b7280;padding:2px 0">Capacity</td><td style="text-align:right;font-weight:600">${formatMW(fac.mwCapacity)}</td></tr>
              <tr><td style="color:#6b7280;padding:2px 0">CapEx</td><td style="text-align:right;font-weight:600">${formatCurrency(fac.capex)}</td></tr>
              <tr><td style="color:#6b7280;padding:2px 0">Committed</td><td style="text-align:right;font-weight:600">${formatCurrency(fac.committed)}</td></tr>
              <tr><td style="color:#6b7280;padding:2px 0">Gap</td><td style="text-align:right;font-weight:600;color:${gap > 0 ? '#ef4444' : '#228B22'}">${formatCurrency(gap)}</td></tr>
              <tr><td style="color:#6b7280;padding:2px 0">Type</td><td style="text-align:right;font-weight:600">${fac.type}</td></tr>
            </table>
          </div>
        `
        new maplibregl.Popup({ closeButton: true, maxWidth: '320px', offset: 14 })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(map)

        if (onFacilityClickRef.current) onFacilityClickRef.current(fac)
      })

      map.on('click', 'africa-fill', (e) => {
        if (!e.features?.[0]) return
        const code = e.features[0].properties?.ISO_A3
        if (code && onCountryClickRef.current) {
          const c = countries.find(c => c.code === code)
          if (c) onCountryClickRef.current(c)
        }
      })

      // Hover tooltip
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 })
      popupRef.current = popup

      map.on('mouseenter', 'facilities-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer'
        if (!e.features?.[0]) return
        const p = e.features[0].properties
        if (!p) return
        popup.setLngLat(e.lngLat).setHTML(
          `<div style="padding:6px 10px;font-size:12px"><strong>${p.name}</strong><br/>${p.mw} MW · ${p.status}</div>`
        ).addTo(map)
      })
      map.on('mouseleave', 'facilities-layer', () => {
        map.getCanvas().style.cursor = ''
        popup.remove()
      })
      map.on('mouseenter', 'africa-fill', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'africa-fill', () => { map.getCanvas().style.cursor = '' })

      // Signal that map is loaded so useEffects can now update data
      setMapLoaded(true)
    })

    mapRef.current = map

    return () => { clearTimeout(timer); ro.disconnect(); map.remove(); mapRef.current = null; setMapLoaded(false) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update facilities markers when data or tab changes (after map is loaded)
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return

    const source = map.getSource('facilities') as maplibregl.GeoJSONSource | undefined
    if (source) {
      source.setData({ type: 'FeatureCollection', features: buildFacilityFeatures(facilities) })
    }
  }, [facilities, tab, mapLoaded])

  // Update choropleth
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return

    if (choroplethMode === 'none' && tab !== 'enabling') {
      map.setPaintProperty('africa-fill', 'fill-color', 'transparent')
      return
    }

    const boundaries = boundariesRef.current
    if (!boundaries) return

    const countryMap = new Map(countries.map(c => [c.code, c]))
    const expr: any[] = ['match', ['get', 'ISO_A3']]
    const features = boundaries.features

    for (const feature of features) {
      const code = feature.properties?.ISO_A3
      const c = countryMap.get(code)
      if (!c) continue

      let color: string
      if (tab === 'enabling') color = scoreColor(c.policyReadiness)
      else if (choroplethMode === 'demand') color = demandColor(c.totalDemandMW)
      else if (choroplethMode === 'tariff') color = c.electricityTariff <= 0.05 ? '#228B22' : c.electricityTariff <= 0.12 ? '#eab308' : c.electricityTariff <= 0.20 ? '#f97316' : '#ef4444'
      else if (choroplethMode === 'sadm') color = demandColor(c.sadmWeight / 2)
      else color = 'transparent'

      expr.push(code, color)
    }
    expr.push('transparent')

    map.setPaintProperty('africa-fill', 'fill-color', expr)
    map.setPaintProperty('africa-fill', 'fill-opacity', tab === 'enabling' ? 0.6 : 0.4)
  }, [choroplethMode, countries, tab, mapLoaded])

  // Update hub links
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return

    if (tab !== 'infrastructure' && tab !== 'sovereign') {
      const source = map.getSource('hub-links') as maplibregl.GeoJSONSource | undefined
      source?.setData({ type: 'FeatureCollection', features: [] })
      return
    }

    const arcs = generateHubArcs(hubLinks)
    const source = map.getSource('hub-links') as maplibregl.GeoJSONSource | undefined
    source?.setData(arcs)
  }, [hubLinks, tab, mapLoaded])

  // Toggle electricity grid
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return
    map.setLayoutProperty('electricity-grid-layer', 'visibility', showGrid ? 'visible' : 'none')
  }, [showGrid, mapLoaded])

  // Toggle fibre network
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return
    map.setLayoutProperty('fibre-network-layer', 'visibility', showFibre ? 'visible' : 'none')
  }, [showFibre, mapLoaded])

  // Fly to facility
  const flyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 8, duration: 1500 })
  }, [])

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__safariMapFlyTo = flyTo
  }, [flyTo])

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
  )
}
