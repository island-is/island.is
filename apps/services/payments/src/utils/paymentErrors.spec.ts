import {
  CardErrorCode,
  DebtPaymentErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { onlyReturnKnownErrorCode } from './paymentErrors'

describe('onlyReturnKnownErrorCode', () => {
  it.each(Object.values(DebtPaymentErrorCode))(
    'passes the debt code %s through',
    (code) => {
      expect(
        onlyReturnKnownErrorCode(code, CardErrorCode.VerificationFailed),
      ).toBe(code)
    },
  )

  it('returns the default for an unknown code', () => {
    expect(onlyReturnKnownErrorCode('SomethingElse')).toBe(
      PaymentServiceCode.UnknownPaymentServiceError,
    )
  })
})
