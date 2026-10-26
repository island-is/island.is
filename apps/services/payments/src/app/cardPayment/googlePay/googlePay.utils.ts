import {
  GooglePayDecryptedWalletPaymentPayload,
  SavedVerificationCompleteData,
} from '../../../types/cardPayment'
import { CardPaymentModuleConfigType } from '../cardPayment.config'
import {
  generateWalletPaymentRequestHeaders,
  iskToAur,
} from '../cardPayment.utils'
import { PaymentTrackingData } from '../../../types'
import { GooglePayPaymentMethodDetails } from './googlePayToken'

/** Valitor WalletPayment with DecryptedPaymentTokenData for a CRYPTOGRAM_3DS token */
export const generateGooglePayDecryptedChargeRequestOptions = ({
  paymentMethodDetails,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  paymentMethodDetails: GooglePayPaymentMethodDetails & { cryptogram: string }
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { systemCalling } = paymentApiConfig

  const body: GooglePayDecryptedWalletPaymentPayload = {
    operation: 'Sale',
    walletPaymentType: 'GooglePay',
    googlePayWalletPayment: {
      decryptedPaymentTokenData: {
        amount: String(iskToAur(amount)),
        cardNumber: paymentMethodDetails.pan,
        currency: 'ISK',
        expirationMonth: paymentMethodDetails.expirationMonth,
        expirationYear: paymentMethodDetails.expirationYear,
        paymentCryptogram: paymentMethodDetails.cryptogram,
        // Google requires the ECI to reach the authorisation unaltered
        ...(paymentMethodDetails.eciIndicator && {
          eci: paymentMethodDetails.eciIndicator,
        }),
      },
    },
    paymentAdditionalData: {
      merchantReferenceData: paymentTrackingData.merchantReferenceData,
    },
    systemCalling,
    correlationId: paymentTrackingData.correlationId,
  }

  return {
    method: 'POST' as const,
    headers: generateWalletPaymentRequestHeaders(paymentApiConfig),
    body: JSON.stringify(body),
  }
}

/**
 * Valitor CardPayment for a PAN_ONLY card once it has passed 3-D Secure, as
 * Valitor's Google Pay guide describes for untokenized cards: an ECommerce
 * payment like a typed card. No CVC: Google does not have one, and the gateway
 * only requires it when no cardVerificationData is sent.
 */
export const generateGooglePaySavedCardChargeRequestOptions = ({
  paymentMethodDetails,
  verificationData,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  paymentMethodDetails: GooglePayPaymentMethodDetails
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
      cardNumber: paymentMethodDetails.pan,
      expirationMonth: paymentMethodDetails.expirationMonth,
      expirationYear: paymentMethodDetails.expirationYear,
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
