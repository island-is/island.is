import React from 'react'
import { render, screen } from '@testing-library/react'

import { HoverTooltip } from './HoverTooltip'

describe('HoverTooltip', () => {
  it('should render its anchor', () => {
    render(
      <HoverTooltip text="The full value">
        <span>Hover me</span>
      </HoverTooltip>,
    )
    expect(screen.getByText('Hover me')).toBeTruthy()
  })

  it('should keep a ref the caller put on the anchor', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <HoverTooltip text="The full value">
        <span ref={ref}>Hover me</span>
      </HoverTooltip>,
    )
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})
