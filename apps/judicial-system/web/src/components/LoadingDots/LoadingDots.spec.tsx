import { render, screen } from '@testing-library/react'

import { LoadingDots } from './LoadingDots'

describe('<LoadingDots />', () => {
  test('should expose a live status region with a default accessible name', () => {
    render(<LoadingDots />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAccessibleName('Hleður')
  })

  test('should allow overriding the accessible name', () => {
    render(<LoadingDots ariaLabel="Sæki gögn" />)

    expect(screen.getByRole('status')).toHaveAccessibleName('Sæki gögn')
  })
})
