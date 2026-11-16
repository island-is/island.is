import { render, screen, waitFor } from '@testing-library/react'

import PopIn from './PopIn'

describe('PopIn', () => {
  it('renders nothing while hidden', () => {
    render(
      <PopIn show={false}>
        <span>Merki</span>
      </PopIn>,
    )

    expect(screen.queryByText('Merki')).not.toBeInTheDocument()
  })

  it('shows its children when shown', () => {
    const { rerender } = render(
      <PopIn show={false}>
        <span>Merki</span>
      </PopIn>,
    )

    rerender(
      <PopIn show>
        <span>Merki</span>
      </PopIn>,
    )

    expect(screen.getByText('Merki')).toBeInTheDocument()
  })

  it('removes its children once the leaving animation ends', async () => {
    const { rerender } = render(
      <PopIn show>
        <span>Merki</span>
      </PopIn>,
    )

    rerender(
      <PopIn show={false}>
        <span>Merki</span>
      </PopIn>,
    )

    await waitFor(() =>
      expect(screen.queryByText('Merki')).not.toBeInTheDocument(),
    )
  })
})
