import {
  CardPaymentSuccessResponse,
  GooglePayCardInformation,
  SavedVerificationCompleteData,
} from '../../../types/cardPayment'
import { CardPaymentModuleConfigType } from '../cardPayment.config'
import {
  generateWalletPaymentRequestHeaders,
  iskToAur,
} from '../cardPayment.utils'
import { PaymentTrackingData } from '../../../types'

/**
 * A Google Pay WalletTransaction that may have charged the token without the
 * saga being able to settle it. Either the request was sent and no answer the
 * saga can act on came back, so the outcome is unknown (`paymentResult`
 * absent), or the gateway charged the token under a correlation id that is
 * not the saga's (`paymentResult` present). Carries the tracking data a
 * refund goes by. A decline is not this: the gateway then said nothing was
 * charged.
 */
export class GooglePayUnsettledChargeError extends Error {
  constructor(
    message: string,
    public readonly paymentTrackingData: PaymentTrackingData,
    public readonly paymentResult?: CardPaymentSuccessResponse,
  ) {
    super(message)
    this.name = 'GooglePayUnsettledChargeError'
    Object.setPrototypeOf(this, GooglePayUnsettledChargeError.prototype)
  }
}

/**
 * Valitor CardPayment WalletTransaction with a Google Pay token (gateway
 * `valitor`). For a card saved in the Google account (PAN_ONLY) it answers Q8
 * with the card, which then goes through 3-D Secure and an ECommerce payment.
 * A device token (CRYPTOGRAM_3DS) it charges outright, as a Sale of the
 * amount; the tracking data then names that payment for the confirmation and
 * a refund.
 * @see https://valitorpay.github.io/
 */
export const generateGooglePayWalletTransactionRequestOptions = ({
  token,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  token: unknown
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { systemCalling } = paymentApiConfig

  return {
    method: 'POST' as const,
    headers: generateWalletPaymentRequestHeaders(paymentApiConfig),
    body: JSON.stringify({
      operation: 'Sale',
      transactionType: 'WalletTransaction',
      currency: 'ISK',
      amount: iskToAur(amount),
      Wallet: {
        WalletType: 'GooglePay',
        GooglePay: token,
      },
      systemCalling,
      additionalData: {
        merchantReferenceData: paymentTrackingData.merchantReferenceData,
      },
      correlationId: paymentTrackingData.correlationId,
    }),
  }
}

/**
 * Valitor CardPayment for a PAN_ONLY card once it has passed 3-D Secure, as
 * Valitor's Google Pay guide describes for untokenized cards: an ECommerce
 * payment like a typed card. No CVC: Google does not have one, and the gateway
 * only requires it when no cardVerificationData is sent.
 */
export const generateGooglePaySavedCardChargeRequestOptions = ({
  card,
  verificationData,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  card: GooglePayCardInformation
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { systemCalling } = paymentApiConfig

  return {
    method: 'POST' as const,
    headers: generateWalletPaymentRequestHeaders(paymentApiConfig),
    body: JSON.stringify({
      operation: 'Sale',
      transactionType: 'ECommerce',
      cardNumber: card.pan,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      currency: 'ISK',
      amount: iskToAur(amount),
      systemCalling,
      cardVerificationData: verificationData,
      additionalData: {
        merchantReferenceData: paymentTrackingData.merchantReferenceData,
      },
      correlationId: paymentTrackingData.correlationId,
    }),
  }
}
