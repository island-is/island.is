import { render, screen, waitFor } from '@testing-library/react'

import ExpandingSection from './ExpandingSection'

describe('ExpandingSection', () => {
  it('renders nothing while hidden', () => {
    render(
      <ExpandingSection show={false}>
        <p>Efni</p>
      </ExpandingSection>,
    )

    expect(screen.queryByText('Efni')).not.toBeInTheDocument()
  })

  it('shows its children and keeps them until the closing animation ends', async () => {
    const { rerender } = render(
      <ExpandingSection show>
        <p>Efni</p>
      </ExpandingSection>,
    )

    expect(screen.getByText('Efni')).toBeInTheDocument()

    rerender(
      <ExpandingSection show={false}>
        <p>Efni</p>
      </ExpandingSection>,
    )

    await waitFor(() =>
      expect(screen.queryByText('Efni')).not.toBeInTheDocument(),
    )
  })

  // What a select menu or a calendar inside the block depends on: once open,
  // the block must not clip, or the menu is cut off and a calendar flips up.
  it('stops clipping once it is open', async () => {
    render(
      <ExpandingSection show animateOnMount>
        <p>Efni</p>
      </ExpandingSection>,
    )

    const block = screen.getByText('Efni').parentElement

    await waitFor(() => expect(block).toHaveStyle({ overflow: 'visible' }))
  })
})
