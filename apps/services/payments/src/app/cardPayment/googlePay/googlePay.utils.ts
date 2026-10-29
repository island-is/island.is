import {
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
 * Valitor CardPayment WalletTransaction that decrypts a Google Pay token
 * (gateway `valitor`). For a card saved in the Google account it answers Q8
 * with the card, which then goes through 3-D Secure and an ECommerce payment.
 * @see https://valitorpay.github.io/
 */
export const generateGooglePayDecryptionRequestOptions = ({
  token,
  paymentApiConfig,
  correlationId,
  amount,
}: {
  token: unknown
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  correlationId: string
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
      correlationId,
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
