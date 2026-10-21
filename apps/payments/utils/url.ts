import { PaymentsGetFlowPaymentStatus } from '@island.is/api/schema'

export const isHttpsUrl = (url: string | undefined | null): url is string => {
  if (!url) {
    return false
  }

  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Where to send the payer when the payment page loads a paid flow: back to the caller when the flow
 * asks to skip the receipt, whichever method paid it. Callers like the application system only
 * finish once the payer is back with them, so this must not depend on the payer pressing a button.
 */
export const getPaidFlowRedirectUrl = (paymentFlow: {
  paymentStatus: PaymentsGetFlowPaymentStatus
  redirectToReturnUrlOnSuccess?: boolean | null
  returnUrl?: string | null
}): string | null => {
  if (
    paymentFlow.paymentStatus !== PaymentsGetFlowPaymentStatus.paid ||
    !paymentFlow.redirectToReturnUrlOnSuccess ||
    !isHttpsUrl(paymentFlow.returnUrl)
  ) {
    return null
  }

  return paymentFlow.returnUrl
}
