import * as turf from '@turf/turf'

const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  ZAF: [25.0, -29.0], NGA: [8.0, 9.0], EGY: [30.0, 26.5], MAR: [-6.0, 32.0],
  DZA: [3.0, 28.0], KEN: [37.9, 0.0], TUN: [9.5, 34.0], ETH: [39.5, 9.0],
  GHA: [-1.0, 7.9], TZA: [35.0, -6.3], CIV: [-5.5, 7.5], SEN: [-14.5, 14.5],
  AGO: [17.9, -11.2], UGA: [32.3, 1.4], ZWE: [29.2, -19.0], CMR: [12.4, 6.0],
  COD: [21.8, -4.0], ZMB: [28.3, -13.1], RWA: [29.9, -1.9], MOZ: [35.5, -18.7],
  NAM: [18.5, -22.0], BWA: [24.7, -22.3], SDN: [30.2, 15.5], DJI: [43.1, 11.6],
  GAB: [11.6, -0.8], MWI: [34.3, -13.3], MDG: [46.9, -18.9], MLI: [-2.0, 17.6],
  BFA: [-1.6, 12.3], SOM: [46.2, 5.2],
}

export function generateArc(
  from: [number, number],
  to: [number, number],
  steps = 50
): GeoJSON.Feature<GeoJSON.LineString> {
  const line = turf.greatCircle(
    turf.point(from),
    turf.point(to),
    { npoints: steps }
  )
  return line as GeoJSON.Feature<GeoJSON.LineString>
}

export function generateHubArcs(
  links: Array<{ from: string; to: string }>
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  const features = links
    .map(link => {
      const fromCoord = COUNTRY_CENTROIDS[link.from]
      const toCoord = COUNTRY_CENTROIDS[link.to]
      if (!fromCoord || !toCoord) return null
      return generateArc(fromCoord, toCoord)
    })
    .filter((f): f is GeoJSON.Feature<GeoJSON.LineString> => f !== null)

  return { type: 'FeatureCollection', features }
}
