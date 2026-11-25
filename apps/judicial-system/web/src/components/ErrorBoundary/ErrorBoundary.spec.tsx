import { render, screen } from '@testing-library/react'

import ErrorBoundary from './ErrorBoundary'

const Bomb = () => {
  throw new Error('test error')
}

describe('ErrorBoundary', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  test('should render children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>content</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  test('should render a fallback and log the error when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Eitthvað fór úrskeiðis')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Endurhlaða síðu' }),
    ).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Unhandled render error: test error'),
      expect.stringContaining('Bomb'),
    )
  })
})
