import React from 'react'
import { render } from '@testing-library/react'

import Timeline from './Timeline'

describe(' Timeline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Timeline getMonthByIndex={() => 'month'} events={[]} />,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render successfully v2', () => {
    const { baseElement } = render(
      <Timeline getMonthByIndex={() => 'month'} events={[]} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
