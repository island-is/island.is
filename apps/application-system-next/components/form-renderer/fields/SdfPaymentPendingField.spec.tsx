import React from 'react'
import { render, waitFor } from '@testing-library/react'

import { SdfPaymentPendingField } from './SdfPaymentPendingField'
import type { FieldRendererProps } from '../types'

const mockUseQuery = jest.fn()

jest.mock('@apollo/client', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}))

jest.mock('@island.is/island-ui/core', () => ({
  AlertMessage: () => null,
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children }: { children?: React.ReactNode }) => (
    <button>{children}</button>
  ),
  LoadingDots: () => null,
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

jest.mock('@island.is/application/core', () => ({
  coreErrorMessages: {},
  coreMessages: {},
}))

jest.mock('@island.is/application/graphql', () => ({ PAYMENT_STATUS: {} }))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: () => '' }),
}))

jest.mock('../../ApplicationContext', () => ({
  useApplicationId: () => 'application-id',
}))

const PAYMENT_URL = 'https://gateway.example/pay'

const renderField = (dispatch: jest.Mock) =>
  render(
    <SdfPaymentPendingField
      {...({ dispatch } as unknown as FieldRendererProps)}
    />,
  )

describe('SdfPaymentPendingField', () => {
  const originalHref = window.location.href

  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: {
        applicationPaymentStatus: { fulfilled: false, paymentUrl: PAYMENT_URL },
      },
      error: undefined,
    })
  })

  afterEach(() => {
    window.history.replaceState(null, '', originalHref)
    jest.clearAllMocks()
  })

  it('sends ABORT when the user comes back cancelled, with the screen id in the address bar', async () => {
    // What the address bar holds after the client names the screen it shows.
    window.history.replaceState(null, '', '/sdf/slug/id?cancelled=&screen=pay')
    const dispatch = jest.fn().mockResolvedValue(undefined)

    renderField(dispatch)

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        'SUBMIT',
        undefined,
        undefined,
        'ABORT',
      ),
    )
    // The cancelled param is gone afterwards, the screen id stays.
    await waitFor(() => expect(window.location.search).toBe('?screen=pay'))
  })

  it('sends SUBMIT when the charge is fulfilled and the user comes back done', async () => {
    mockUseQuery.mockReturnValue({
      data: {
        applicationPaymentStatus: { fulfilled: true, paymentUrl: PAYMENT_URL },
      },
      error: undefined,
    })
    window.history.replaceState(null, '', '/sdf/slug/id?done=&screen=pay')
    const dispatch = jest.fn().mockResolvedValue(undefined)

    renderField(dispatch)

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        'SUBMIT',
        undefined,
        undefined,
        'SUBMIT',
      ),
    )
  })
})
