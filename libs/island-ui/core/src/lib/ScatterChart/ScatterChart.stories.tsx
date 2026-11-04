import React from 'react'

import { ScatterChart, ScatterChartPoint } from './ScatterChart'

export default {
  title: 'Charts/ScatterChart',
  component: ScatterChart,
}

const points = (offset: number, marked: number[] = []): ScatterChartPoint[] =>
  Array.from({ length: 12 }, (_, i) => {
    const x = 400 + i * 40 + offset
    const y = Math.round(3000 * Math.exp(0.0018 * x) + (i % 3) * 300)
    return {
      x,
      y,
      marked: marked.includes(i),
      tooltip: {
        title: `Starfsmaður ${i + 1}`,
        rows: [
          { label: 'Stig', value: String(x) },
          { label: 'Tímakaup', value: `${y} kr./klst.` },
        ],
        note: marked.includes(i)
          ? { text: 'Frávik', color: 'red600' }
          : undefined,
      },
    }
  })

const axes = {
  xAxis: {
    label: 'Starfsmatsstig',
    domain: [0, 1000] as [number, number],
    ticks: [0, 250, 500, 750, 1000],
  },
  yAxis: {
    label: 'kr./klst.',
    domain: [0, 15000] as [number, number],
    ticks: [0, 3750, 7500, 11250, 15000],
    width: 95,
  },
}

export const Default = () => (
  <ScatterChart
    title="Dreifing tímakaups eftir starfsmatsstigum"
    description="Viðmiðunarlínan sýnir vænt tímakaup miðað við heildarstig."
    series={[
      { name: 'Karlar', color: 'blue400', points: points(20) },
      { name: 'Konur', color: 'purple400', points: points(0, [4]) },
    ]}
    line={{
      name: 'Vænt tímakaup',
      color: 'roseTinted400',
      points: Array.from({ length: 13 }, (_, i) => {
        const x = 400 + i * 40
        return { x, y: Math.round(3000 * Math.exp(0.0018 * x)) }
      }),
    }}
    markedLegendLabel="Frávik"
    {...axes}
  />
)

export const PointsOnly = () => (
  <ScatterChart
    series={[{ name: 'Karlar', color: 'blue400', points: points(0) }]}
    {...axes}
  />
)

export const DiamondSeries = () => (
  <ScatterChart
    series={[
      { name: 'Karlar', color: 'blue400', points: points(20) },
      {
        name: 'Konur',
        color: 'purple400',
        shape: 'diamond',
        points: points(0, [4]),
      },
    ]}
    {...axes}
  />
)
