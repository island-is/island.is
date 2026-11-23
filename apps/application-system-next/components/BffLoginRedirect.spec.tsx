/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import { replaceLocation } from '../lib/navigation'
import { BffLoginRedirect } from './BffLoginRedirect'

jest.mock('../lib/navigation', () => ({
  replaceLocation: jest.fn(),
}))

describe('BffLoginRedirect', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('hard navigates to the bff login url and renders a fallback link', async () => {
    render(
      <BffLoginRedirect targetLinkUri="http://localhost:4250/umsoknir/example-inputs/app-1?screen=page-2" />,
    )

    await waitFor(() => {
      expect(replaceLocation).toHaveBeenCalledWith(
        '/bff/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fscreen%3Dpage-2',
      )
    })

    expect(
      screen
        .getByRole('link', { name: 'continue manually' })
        .getAttribute('href'),
    ).toBe(
      '/bff/login?target_link_uri=http%3A%2F%2Flocalhost%3A4250%2Fumsoknir%2Fexample-inputs%2Fapp-1%3Fscreen%3Dpage-2',
    )
  })
})
