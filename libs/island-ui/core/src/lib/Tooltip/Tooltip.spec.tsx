import React from 'react'
import { render } from '@testing-library/react'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Tooltip text="Here is the text for the tooltip." />,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render successfully with children', () => {
    const { baseElement } = render(
      <Tooltip text="Here is the text for the tooltip.">
        <span>Hover me</span>
      </Tooltip>,
    )
    expect(baseElement).toBeTruthy()
  })
})
