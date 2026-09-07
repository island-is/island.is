import { fireEvent, render, screen } from '@testing-library/react'

import { AlertBanner } from './index'

describe('AlertBanner', () => {
  test('should give the dismiss button a descriptive accessible name', () => {
    render(<AlertBanner title="Villa" dismissable />)

    expect(screen.getByRole('button', { name: 'Loka' })).toBeInTheDocument()
  })

  test('should dismiss the banner when the close button is activated', () => {
    const onDismiss = jest.fn()
    render(<AlertBanner title="Villa" dismissable onDismiss={onDismiss} />)

    fireEvent.click(screen.getByRole('button', { name: 'Loka' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Villa')).not.toBeInTheDocument()
  })
})
