import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { Icon } from './Icon'

// Stands in for an icon chunk that cannot be fetched, e.g. while offline.
jest.mock('./icons/Warning.tsx', () => {
  throw new Error('Loading chunk 3235 failed.')
})

describe(' Icon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Icon type="outline" icon="chevronForward" />,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render title', () => {
    const renderedIcon = render(
      <Icon
        type="filled"
        icon="chevronForward"
        title="chevronForward"
        titleId="chevronForward"
      />,
    )
    expect(renderedIcon).toBeTruthy()
  })
  it('renders a blank of the same size instead of throwing when the icon chunk cannot be loaded', async () => {
    const { container } = render(<Icon icon="warning" size="large" />)

    await waitFor(() =>
      expect(container.querySelector('span')).toHaveStyle({
        width: '32px',
        height: '32px',
      }),
    )
    expect(screen.queryByTestId('icon-warning')).not.toBeInTheDocument()
  })
})
