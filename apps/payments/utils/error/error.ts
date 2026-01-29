import { MessageDescriptor } from 'react-intl'

import {
  CardErrorCode,
  FjsErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'

import { cardError, genericError } from '../../messages'

export type PaymentError = {
  code: CardErrorCode
  meta?: Record<string, string | number>
}

export const paymentErrorToTitleAndMessage = (
  error: PaymentError,
): { title: MessageDescriptor; message: MessageDescriptor } => {
  const { code, meta } = error

  switch (code as CardErrorCode | FjsErrorCode | PaymentServiceCode) {
    case CardErrorCode.InsufficientFunds:
      return {
        title: cardError.insufficientFundsTitle,
        message: cardError.insufficientFunds,
      }
    case CardErrorCode.ExpiredCard:
      return {
        title: cardError.expiredCardTitle,
        message: cardError.expiredCard,
      }
    case CardErrorCode.InvalidCardNumber:
      return {
        title: cardError.invalidCardNumberTitle,
        message: cardError.invalidCardNumber,
      }
    case CardErrorCode.InvalidCardExpiry:
      return {
        title: cardError.invalidCardExpiryTitle,
        message: cardError.invalidCardExpiry,
      }
    case CardErrorCode.InvalidCardCVC:
      return {
        title: cardError.invalidCardCVCTitle,
        message: cardError.invalidCardCVC,
      }
    case CardErrorCode.InvalidCard:
      return {
        title: cardError.invalidCardTitle,
        message: cardError.invalidCard,
      }
    case CardErrorCode.LostCard:
      return {
        title: cardError.lostCardTitle,
        message: cardError.lostCard,
      }
    case CardErrorCode.StolenCard:
      return {
        title: cardError.stolenCardTitle,
        message: cardError.stolenCard,
      }
    case CardErrorCode.ClosedAccount:
      return {
        title: cardError.closedAccountTitle,
        message: cardError.closedAccount,
      }
    case CardErrorCode.TransactionNotPermitted:
      return {
        title: cardError.transactionNotPermittedTitle,
        message: cardError.transactionNotPermitted,
      }
    case CardErrorCode.RestrictedCard:
      return {
        title: cardError.restrictedCardTitle,
        message: cardError.restrictedCard,
      }
    case CardErrorCode.SuspectedFraud:
      return {
        title: cardError.suspectedFraudTitle,
        message: cardError.suspectedFraud,
      }
    case CardErrorCode.ExceedsWithdrawalLimit:
      return {
        title: cardError.exceedsWithdrawalLimitTitle,
        message: cardError.exceedsWithdrawalLimit,
      }
    case CardErrorCode.SecurityViolation:
      return {
        title: cardError.securityViolationTitle,
        message: cardError.securityViolation,
      }
    case CardErrorCode.AdditionalAuthenticationRequired:
      return {
        title: cardError.additionalAuthenticationRequiredTitle,
        message: cardError.additionalAuthenticationRequired,
      }
    case CardErrorCode.ContactIssuer:
      return {
        title: cardError.contactIssuerTitle,
        message: cardError.contactIssuer,
      }
    case CardErrorCode.IssuerUnavailable:
      return {
        title: cardError.issuerUnavailableTitle,
        message: cardError.issuerUnavailable,
      }
    case CardErrorCode.DuplicateTransaction:
      return {
        title: cardError.duplicateTransactionTitle,
        message: cardError.duplicateTransaction,
      }
    case CardErrorCode.TransactionTimedOut:
      return {
        title: cardError.transactionTimedOutTitle,
        message: cardError.transactionTimedOut,
      }
    case CardErrorCode.StopPaymentOrder:
      return {
        title: cardError.stopPaymentOrderTitle,
        message: cardError.stopPaymentOrder,
      }
    case CardErrorCode.RevocationOfAuthorization:
      return {
        title: cardError.revocationOfAuthorizationTitle,
        message: cardError.revocationOfAuthorization,
      }
    case CardErrorCode.RevocationOfAllAuthorizations:
      return {
        title: cardError.revocationOfAllAuthorizationsTitle,
        message: cardError.revocationOfAllAuthorizations,
      }
    case CardErrorCode.PaymentSystemUnavailable:
      return {
        title: cardError.paymentSystemUnavailableTitle,
        message: cardError.paymentSystemUnavailable,
      }
    case CardErrorCode.GenericDecline:
      return {
        title: cardError.genericDeclineTitle,
        message: cardError.genericDecline,
      }
    case CardErrorCode.VerificationDeadlineExceeded:
      return {
        title: cardError.verificationDeadlineExceededTitle,
        message: cardError.verificationDeadlineExceeded,
      }
    case FjsErrorCode.AlreadyCreatedCharge:
      return {
        title: genericError.alreadyPaidTitle,
        message: genericError.alreadyPaid,
      }
    case PaymentServiceCode.PaymentFlowAmountMismatch:
      return {
        title: genericError.amountMismatchTitle,
        message: genericError.amountMismatch,
      }
    case CardErrorCode.RefundedBecauseOfSystemError:
      return {
        title: cardError.refundedBecauseOfSystemErrorTitle,
        message: cardError.refundedBecauseOfSystemError,
      }
    case CardErrorCode.ErrorGettingApplePaySession:
      return {
        title: cardError.errorGettingApplePaySessionTitle,
        message: cardError.errorGettingApplePaySession,
      }
    default:
      return {
        title: cardError.unknownTitle,
        message: cardError.unknown,
      }
  }
}

export const getErrorTitleAndMessage = (
  invalidFlowSetup: boolean,
  paymentError: PaymentError | null,
) => {
  let errorTitle = null
  let errorMessage = null

  const hasPaymentError = paymentError !== null
  const canRenderMainFlow = !invalidFlowSetup && !hasPaymentError

  if (!canRenderMainFlow) {
    if (invalidFlowSetup) {
      errorTitle = genericError.fetchFailedTitle
      errorMessage = genericError.fetchFailed
    } else if (hasPaymentError) {
      const { title, message } = paymentErrorToTitleAndMessage({
        code: paymentError.code,
        meta: {},
      })

      errorTitle = title
      errorMessage = message
    } else {
      errorTitle = genericError.title
      errorMessage = genericError.description
    }
  }

  return { errorTitle, errorMessage }
}
