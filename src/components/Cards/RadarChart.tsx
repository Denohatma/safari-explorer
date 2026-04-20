import { useEffect, useRef } from 'react'
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import { DIMENSION_LABELS } from '../../types'

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

interface Props {
  scores: Record<string, number>
  size?: number
}

const DIMS = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12']

export function RadarChart({ scores, size = 200 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: DIMS.map(d => DIMENSION_LABELS[d] ?? d),
        datasets: [{
          data: DIMS.map(d => scores[d] ?? 0),
          backgroundColor: 'rgba(34, 139, 34, 0.15)',
          borderColor: '#228B22',
          borderWidth: 2,
          pointBackgroundColor: '#228B22',
          pointRadius: 3,
        }],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, font: { size: 9 }, backdropColor: 'transparent' },
            pointLabels: { font: { size: 8 }, color: '#666' },
            grid: { color: '#e5e7eb' },
          },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [scores])

  return <canvas ref={canvasRef} width={size} height={size} />
}
