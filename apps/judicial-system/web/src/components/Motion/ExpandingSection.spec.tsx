import { render, screen, waitFor } from '@testing-library/react'

import ExpandingSection from './ExpandingSection'

let mockReduceMotion = false

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => mockReduceMotion,
}))

describe('ExpandingSection', () => {
  beforeEach(() => {
    mockReduceMotion = false
  })

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
  it('clips while it opens and stops once it is open', async () => {
    const { rerender } = render(
      <ExpandingSection show={false}>
        <p>Efni</p>
      </ExpandingSection>,
    )

    rerender(
      <ExpandingSection show>
        <p>Efni</p>
      </ExpandingSection>,
    )

    const block = screen.getByText('Efni').parentElement

    expect(block).toHaveStyle({ overflow: 'hidden' })

    await waitFor(() => expect(block).toHaveStyle({ overflow: 'visible' }))
  })

  it('stops clipping once it has played in on mount', async () => {
    render(
      <ExpandingSection show animateOnMount>
        <p>Efni</p>
      </ExpandingSection>,
    )

    const block = screen.getByText('Efni').parentElement

    await waitFor(() => expect(block).toHaveStyle({ overflow: 'visible' }))
  })

  // A block already open on the first render is not played in, so nothing
  // ever reports an animation complete. It has to start unclipped instead.
  it('does not clip a block that is open from the start', () => {
    render(
      <ExpandingSection show>
        <p>Efni</p>
      </ExpandingSection>,
    )

    expect(screen.getByText('Efni').parentElement).toHaveStyle({
      overflow: 'visible',
    })
  })

  it('still opens, and stops clipping, when motion is reduced', async () => {
    mockReduceMotion = true

    const { rerender } = render(
      <ExpandingSection show={false}>
        <p>Efni</p>
      </ExpandingSection>,
    )

    rerender(
      <ExpandingSection show>
        <p>Efni</p>
      </ExpandingSection>,
    )

    const block = screen.getByText('Efni').parentElement

    await waitFor(() => expect(block).toHaveStyle({ overflow: 'visible' }))
  })
})
