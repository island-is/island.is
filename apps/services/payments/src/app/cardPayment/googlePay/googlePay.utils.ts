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

// TEMPORARY: verbose logging while Google Pay is tested on production, where
// Valitor's answers are first seen. Remove, with the calls in
// CardPaymentService, once the flow is verified there.

/** The shape of the token pay.js handed over, without its contents */
export const describeGooglePayTokenForTesting = (parsed: unknown) => {
  const token = (parsed ?? {}) as Record<string, unknown>
  const signingKey = (token.intermediateSigningKey ?? {}) as Record<
    string,
    unknown
  >
  let keyExpiration: string | undefined
  try {
    const signedKey = JSON.parse(String(signingKey.signedKey ?? '{}')) as {
      keyExpiration?: string
    }
    keyExpiration = signedKey.keyExpiration
      ? new Date(Number(signedKey.keyExpiration)).toISOString()
      : undefined
  } catch {
    keyExpiration = 'unparseable'
  }

  return {
    keys: Object.keys(token),
    protocolVersion: token.protocolVersion,
    signedMessageLength:
      typeof token.signedMessage === 'string'
        ? token.signedMessage.length
        : undefined,
    hasSignature: typeof token.signature === 'string',
    signingKeySignatures: Array.isArray(signingKey.signatures)
      ? signingKey.signatures.length
      : undefined,
    signingKeyExpiration: keyExpiration,
  }
}

const GATEWAY_RESPONSE_FIELDS_LOGGED = [
  'isSuccess',
  'responseCode',
  'responseDescription',
  'responseTime',
  'correlationID',
  'cardInformation',
  'maskedCardNumber',
  'transactionID',
  'authorizationCode',
  'acquirerReferenceNumber',
  'transactionLifecycleId',
  'authorizationIdentifier',
  'authenticationMethod',
  'authorizedAmount',
  'marketInformation',
  'transactionType',
  'currency',
  'isCardPresent',
  'postUrl',
  'threeDSMessageVersion',
  'scriptPath',
  'additionalFields',
  'title',
  'errors',
] as const

/**
 * A gateway response as it may be logged: known non-card fields as they are,
 * every key named, and the decrypted card described without its number or
 * expiry.
 */
export const describeGatewayResponseForTesting = (raw: unknown) => {
  const body = (raw ?? {}) as Record<string, unknown>
  const logged: Record<string, unknown> = { keys: Object.keys(body) }
  for (const field of GATEWAY_RESPONSE_FIELDS_LOGGED) {
    if (field in body) logged[field] = body[field]
  }

  const card = body.googlePayCardInformation as
    | Record<string, unknown>
    | undefined
  if (card && typeof card === 'object') {
    const pan = typeof card.pan === 'string' ? card.pan : undefined
    const year = card.expirationYear
    logged.googlePayCardInformation = {
      keys: Object.keys(card),
      panLength: pan?.length,
      panLast4: pan?.slice(-4),
      expirationMonthType: typeof card.expirationMonth,
      expirationYearType: typeof year,
      expirationYearDigits:
        year === undefined ? undefined : String(year).length,
    }
  }

  return logged
}
