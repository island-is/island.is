import {
  PaymentServiceCode,
  FjsErrorCode,
  CardErrorCode,
  InvoiceErrorCode,
  PaymentErrorCode,
} from '@island.is/shared/constants'

const ERROR_ENUMS = [
  PaymentServiceCode,
  FjsErrorCode,
  CardErrorCode,
  InvoiceErrorCode,
]

export const onlyReturnKnownErrorCode = (
  errorMessage: string,
  defaultError = PaymentServiceCode.UnknownPaymentServiceError as PaymentErrorCode,
): PaymentErrorCode => {
  for (const errorEnum of ERROR_ENUMS) {
    if (errorMessage in errorEnum) {
      return errorMessage as PaymentErrorCode
    }
  }

  return defaultError
}
