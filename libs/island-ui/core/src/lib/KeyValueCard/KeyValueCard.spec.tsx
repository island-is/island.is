import React from 'react'
import { render, screen, within } from '@testing-library/react'

import { KeyValueCard } from './KeyValueCard'

describe('KeyValueCard', () => {
  it('keeps each item in its own column when columns differ in length', () => {
    const { container } = render(
      <KeyValueCard
        columns={[
          [{ label: 'Skilaskylda jafnréttisáætlun', value: 'Nei' }],
          [
            { label: 'Skilaskylda skýrslugjöf', value: 'Já' },
            { label: 'Næstu skil skýrslu', value: '28.02.2027' },
          ],
        ]}
      />,
    )

    const [first, second] = Array.from(container.querySelectorAll('dl'))
    expect(within(first).getAllByRole('term')).toHaveLength(1)
    expect(within(second).getByText('Næstu skil skýrslu')).toBeInTheDocument()
    expect(within(second).getByText('28.02.2027')).toBeInTheDocument()
  })

  it('shows labels but not values while loading', () => {
    render(
      <KeyValueCard
        loading
        columns={[[{ label: 'Skilaskylda skýrslugjöf', value: 'Já' }]]}
      />,
    )
    expect(screen.getByText('Skilaskylda skýrslugjöf')).toBeInTheDocument()
    expect(screen.queryByText('Já')).not.toBeInTheDocument()
  })

  it('renders the image as decorative', () => {
    const { container } = render(
      <KeyValueCard
        img="/illustration.svg"
        columns={[[{ label: 'Skilaskylda skýrslugjöf', value: 'Já' }]]}
      />,
    )
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })
})
