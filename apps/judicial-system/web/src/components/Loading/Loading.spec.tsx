import { render, screen } from '@testing-library/react'

import Loading from './Loading'

describe('<Loading />', () => {
  test('should expose a live status region for screen readers', () => {
    render(<Loading />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Sæki gögn')
  })
})
