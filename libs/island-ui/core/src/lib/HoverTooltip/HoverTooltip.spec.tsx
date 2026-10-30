import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it('should show the tooltip on hover', async () => {
    const user = userEvent.setup()
    render(
      <HoverTooltip text="The full value">
        <span>Hover me</span>
      </HoverTooltip>,
    )
    await user.hover(screen.getByText('Hover me'))
    expect(await screen.findByText('The full value')).toBeInTheDocument()
  })

  it('should show the tooltip on keyboard focus', async () => {
    const user = userEvent.setup()
    render(
      <HoverTooltip text="The full value">
        <span tabIndex={0}>Hover me</span>
      </HoverTooltip>,
    )
    await user.tab()
    expect(await screen.findByText('The full value')).toBeInTheDocument()
  })

  it('should show the tooltip on tap, for touch devices with no hover', async () => {
    const user = userEvent.setup()
    render(
      <HoverTooltip text="The full value">
        <span>Hover me</span>
      </HoverTooltip>,
    )
    await user.pointer({
      keys: '[TouchA]',
      target: screen.getByText('Hover me'),
    })
    expect(await screen.findByText('The full value')).toBeInTheDocument()
  })
})
