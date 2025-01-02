import { MessageDescriptor } from 'react-intl'
import { CardErrorCode } from './constants'
import { cardError, genericError } from '../../messages'

export type PaymentError = {
  code: CardErrorCode
  meta: Record<string, string | number>
}

export const paymentErrorToTitleAndMessage = (
  error: PaymentError,
): { title: MessageDescriptor; message: MessageDescriptor } => {
  const { code, meta } = error

  switch (code as CardErrorCode) {
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
