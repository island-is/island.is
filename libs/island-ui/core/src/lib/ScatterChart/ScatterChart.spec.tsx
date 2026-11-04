import React from 'react'
import { render } from '@testing-library/react'

import { ScatterChart } from './ScatterChart'

describe('ScatterChart', () => {
  it('renders with series, a line and a marked point', () => {
    const { baseElement } = render(
      <ScatterChart
        title="Dreifing"
        description="Lýsing"
        series={[
          {
            name: 'Karlar',
            color: 'blue400',
            points: [{ x: 100, y: 4000, marked: true }],
          },
          { name: 'Konur', color: 'purple400', shape: 'diamond', points: [] },
        ]}
        line={{
          name: 'Vænt tímakaup',
          color: 'roseTinted400',
          points: [
            { x: 0, y: 3000 },
            { x: 200, y: 5000 },
          ],
        }}
        markedLegendLabel="Frávik"
        xAxis={{ label: 'Starfsmatsstig', domain: [0, 250], ticks: [0, 250] }}
        yAxis={{ label: 'kr./klst.', domain: [0, 6000], ticks: [0, 6000] }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
