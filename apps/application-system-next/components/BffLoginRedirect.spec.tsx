/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import { BffLoginRedirect } from './BffLoginRedirect'

describe('BffLoginRedirect', () => {
  const originalLocation = window.location

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
    jest.restoreAllMocks()
  })

  it('hard navigates to the bff login url and renders a fallback link', async () => {
    const replace = jest.fn()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        replace,
      },
    })

    render(
      <BffLoginRedirect
        targetLinkUri="http://localhost:4250/umsoknir/example-inputs/app-1?step=2"
      />,
    )

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(
        '/bff/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fstep%3D2',
      )
    })

    expect(
      screen.getByRole('link', { name: 'continue manually' }).getAttribute(
        'href',
      ),
    ).toBe(
      '/bff/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fstep%3D2',
    )
  })
})
