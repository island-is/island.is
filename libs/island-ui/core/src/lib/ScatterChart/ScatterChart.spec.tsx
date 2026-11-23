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
    const { container, getByRole, getAllByRole } = render(
      <ScatterChart
        title="Dreifing"
        dataTable={{
          caption: 'Dreifing',
          titleHeader: 'Starfsmaður',
          seriesHeader: 'Hópur',
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
                  title: 'Starfsmaður 1',
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
    ).toEqual(['Starfsmaður', 'Hópur', 'Kyn', 'Stig', 'Frávik'])
    expect(getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual([
      'Starfsmaður 1',
    ])
    expect(getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      'Karlar',
      'Karl',
      '100',
      'Frávik',
    ])
    const chart = container.querySelector('[aria-hidden="true"]')
    expect(chart).toBeTruthy()
    expect(
      chart?.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ).length,
    ).toBe(0)
  })
})
