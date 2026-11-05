import { DebtPaymentErrorCode } from '@island.is/shared/constants'

import { debtError } from '../../messages'
import { isTerminalDebtError, paymentErrorToTitleAndMessage } from './error'

describe('debt payment errors', () => {
  it('tells the payer a rejected bank transfer is refunded by hand', () => {
    expect(
      paymentErrorToTitleAndMessage({
        code: DebtPaymentErrorCode.DebtPaymentRejectedRefundPending,
      }),
    ).toEqual({
      title: debtError.closedTitle,
      message: debtError.refundPending,
    })
  })

  it.each([
    DebtPaymentErrorCode.DebtPaymentFlowClosed,
    DebtPaymentErrorCode.DebtPaymentRejected,
    DebtPaymentErrorCode.DebtPaymentRejectedRefundPending,
    DebtPaymentErrorCode.DebtPaymentInvalid,
  ])('%s ends the flow', (code) => {
    expect(isTerminalDebtError(code)).toBe(true)
  })

  it.each([
    DebtPaymentErrorCode.DebtPaymentUnavailable,
    DebtPaymentErrorCode.DebtPaymentMethodNotAllowed,
    undefined,
  ])('%s does not', (code) => {
    expect(isTerminalDebtError(code)).toBe(false)
  })
})
