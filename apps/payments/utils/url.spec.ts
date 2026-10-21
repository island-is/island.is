import { PaymentsGetFlowPaymentStatus } from '@island.is/api/schema'

import { getPaidFlowRedirectUrl, isHttpsUrl } from './url'

describe('isHttpsUrl', () => {
  it.each(['https://blikk.tech/sca', 'https://example.com/path?q=1'])(
    'accepts https URL %s',
    (url) => {
      expect(isHttpsUrl(url)).toBe(true)
    },
  )

  it.each([
    'http://blikk.tech/sca',

    'javascript:alert(1)',
    'data:text/html,evil',
    'ftp://example.com',
    '/relative/path',
    'not a url',
    '',
    undefined,
    null,
  ])('rejects non-https value %s', (url) => {
    expect(isHttpsUrl(url as string | undefined | null)).toBe(false)
  })
})

describe('getPaidFlowRedirectUrl', () => {
  const returnUrl = 'https://island.is/umsoknir/okuskirteini/abc?done'
  const paidFlow = {
    paymentStatus: PaymentsGetFlowPaymentStatus.paid,
    redirectToReturnUrlOnSuccess: true,
    returnUrl,
  }

  it('returns the return url for a paid flow that asks to skip the receipt', () => {
    expect(getPaidFlowRedirectUrl(paidFlow)).toBe(returnUrl)
  })

  it.each([
    PaymentsGetFlowPaymentStatus.unpaid,
    PaymentsGetFlowPaymentStatus.invoice_pending,
    PaymentsGetFlowPaymentStatus.bank_transfer_pending,
  ])('does not redirect a %s flow', (paymentStatus) => {
    expect(getPaidFlowRedirectUrl({ ...paidFlow, paymentStatus })).toBeNull()
  })

  it.each([false, null, undefined])(
    'does not redirect when redirectToReturnUrlOnSuccess is %s',
    (redirectToReturnUrlOnSuccess) => {
      expect(
        getPaidFlowRedirectUrl({ ...paidFlow, redirectToReturnUrlOnSuccess }),
      ).toBeNull()
    },
  )

  it.each([null, undefined, '', 'http://island.is/x', 'javascript:alert(1)'])(
    'does not redirect to a missing or non-https return url %s',
    (url) => {
      expect(getPaidFlowRedirectUrl({ ...paidFlow, returnUrl: url })).toBeNull()
    },
  )
})
