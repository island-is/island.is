import { render, screen } from '@testing-library/react'

import FadeSwap from './FadeSwap'

describe('FadeSwap', () => {
  it('shows its content', () => {
    render(
      <FadeSwap swapKey="a">
        <p>Efni</p>
      </FadeSwap>,
    )

    expect(screen.getByText('Efni')).toBeInTheDocument()
  })

  // What keeps the page still: the old and the new content never take up
  // room at the same time.
  it('shows the new content once the old has left', async () => {
    const { rerender } = render(
      <FadeSwap swapKey="a">
        <p>Gamalt</p>
      </FadeSwap>,
    )

    rerender(
      <FadeSwap swapKey="b">
        <p>Nýtt</p>
      </FadeSwap>,
    )

    expect(screen.getByText('Gamalt')).toBeInTheDocument()
    expect(screen.queryByText('Nýtt')).not.toBeInTheDocument()

    expect(await screen.findByText('Nýtt')).toBeInTheDocument()
    expect(screen.queryByText('Gamalt')).not.toBeInTheDocument()
  })

  it('updates the content in place while the key stays', () => {
    const { rerender } = render(
      <FadeSwap swapKey="a">
        <p>Gamalt</p>
      </FadeSwap>,
    )

    rerender(
      <FadeSwap swapKey="a">
        <p>Nýtt</p>
      </FadeSwap>,
    )

    expect(screen.getByText('Nýtt')).toBeInTheDocument()
    expect(screen.queryByText('Gamalt')).not.toBeInTheDocument()
  })
})
