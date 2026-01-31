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

export const mapToCardErrorCode = (originalCode: string): CardErrorCode => {
  // Only the first two characters are used to map the error code
  const firstTwoCharacters = originalCode?.slice(0, 2)

  const errorCodeMap: Record<string, CardErrorCode> = {
    '51': CardErrorCode.InsufficientFunds,
    '54': CardErrorCode.ExpiredCard,
    '41': CardErrorCode.LostCard,
    '43': CardErrorCode.StolenCard,
    '46': CardErrorCode.ClosedAccount,
    '57': CardErrorCode.TransactionNotPermitted,
    '62': CardErrorCode.RestrictedCard,
    '59': CardErrorCode.SuspectedFraud,
    '61': CardErrorCode.ExceedsWithdrawalLimit,
    '63': CardErrorCode.SecurityViolation,
    '65': CardErrorCode.AdditionalAuthenticationRequired,
    '70': CardErrorCode.ContactIssuer,
    '91': CardErrorCode.IssuerUnavailable,
    '94': CardErrorCode.DuplicateTransaction,
    '96': CardErrorCode.PaymentSystemUnavailable,
    '92': CardErrorCode.TransactionTimedOut,
    R0: CardErrorCode.StopPaymentOrder,
    R1: CardErrorCode.RevocationOfAuthorization,
    R3: CardErrorCode.RevocationOfAllAuthorizations,
  }

  // Return the mapped value or the default
  return errorCodeMap[firstTwoCharacters] || CardErrorCode.GenericDecline
}
