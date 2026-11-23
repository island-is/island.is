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

  it('renders the points as a table when dataTable is given', () => {
    const { getByRole, getAllByRole } = render(
      <ScatterChart
        title="Dreifing"
        dataTable={{
          caption: 'Dreifing',
          seriesHeader: 'Kyn',
          noteHeader: 'Frávik',
        }}
        series={[
          {
            name: 'Karlar',
            color: 'blue400',
            points: [
              {
                x: 100,
                y: 4000,
                marked: true,
                tooltip: {
                  title: 'Karl',
                  rows: [
                    { label: 'Kyn', value: 'Karl' },
                    { label: 'Stig', value: '100' },
                  ],
                  note: { text: 'Frávik' },
                },
              },
            ],
          },
        ]}
        xAxis={{ label: 'Starfsmatsstig', domain: [0, 250], ticks: [0, 250] }}
        yAxis={{ label: 'kr./klst.', domain: [0, 6000], ticks: [0, 6000] }}
      />,
    )
    expect(getByRole('table', { name: 'Dreifing' })).toBeTruthy()
    expect(
      getAllByRole('columnheader').map((cell) => cell.textContent),
    ).toEqual(['Kyn', 'Stig', 'Frávik'])
    expect(getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      'Karlar',
      '100',
      'Frávik',
    ])
  })
})
