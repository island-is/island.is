import crypto from 'crypto'
import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'
import { Agent } from 'undici'

import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'

import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'
import {
  MdNormalised,
  MdSerialized,
  SavedVerificationCompleteData,
  ApplePayDecryptedWalletPaymentPayload,
} from '../../types/cardPayment'

import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CardPaymentModuleConfigType } from './cardPayment.config'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { CatalogItemWithQuantity } from '../../types/charges'
import { PaymentTrackingData } from '../../types'
import { APPLE_PAY_ALLOWED_VALIDATION_HOSTS } from './applePay.constants'

const MdSerializedSchema = z.object({
  c: z.string().length(36, 'Correlation ID must be 36 characters long'),
  iat: z.number(),
})

const iskToAur = (amount: number) => amount * 100

export const generateMd = ({
  correlationId,
  paymentsTokenSigningSecret,
  paymentsTokenSigningAlgorithm,
}: {
  correlationId: string
  paymentFlowId: string
  amount: number
  paymentsTokenSigningSecret: string
  paymentsTokenSigningAlgorithm: string
}) => {
  const mdSerialized: Omit<MdSerialized, 'iat'> = {
    c: correlationId,
  }

  const mdToken = sign(mdSerialized, paymentsTokenSigningSecret, {
    algorithm: paymentsTokenSigningAlgorithm as Algorithm,
  })

  return Buffer.from(mdToken).toString('base64')
}

export const generateVerificationRequestOptions = ({
  verifyCardInput,
  md,
  paymentApiConfig,
  webOrigin,
  amount,
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  webOrigin: string
  amount: number
}) => {
  const { cardNumber, expiryMonth, expiryYear } = verifyCardInput
  const {
    paymentsApiSecret,
    paymentsApiHeaderKey,
    paymentsApiHeaderValue,
    systemCalling,
  } = paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      cardNumber: cardNumber.toString(),
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cardholderDeviceType: 'WWW',
      amount: iskToAur(amount),
      currency: 'ISK',
      authenticationUrl: `${webOrigin}/api/card/callback`,
      MD: md,
      systemCalling,
    }),
  }

  return requestOptions
}

export const generateChargeRequestOptions = ({
  chargeCardInput,
  verificationData,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  chargeCardInput: ChargeCardInput
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { cardNumber, expiryMonth, expiryYear, cvc } = chargeCardInput
  const {
    paymentsApiSecret,
    paymentsApiHeaderKey,
    paymentsApiHeaderValue,
    systemCalling,
  } = paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      operation: 'Sale',
      transactionType: 'ECommerce',
      cardNumber: cardNumber.toString(),
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
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

  return requestOptions
}

export const generateRefundRequestOptions = ({
  amount,
  cardNumber,
  acquirerReferenceNumber,
  paymentApiConfig,
}: {
  amount: number
  cardNumber: string
  acquirerReferenceNumber: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
}) => {
  const {
    paymentsApiSecret,
    paymentsApiHeaderKey,
    paymentsApiHeaderValue,
    systemCalling,
  } = paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      operation: 'Refund',
      transactionType: 'ECommerce',
      cardNumber: cardNumber,
      currency: 'ISK',
      amount: iskToAur(amount),
      acquirerReferenceNumber: acquirerReferenceNumber,
      systemCalling,
    }),
  }

  return requestOptions
}

export const getPayloadFromMd = ({
  md,
  paymentsTokenSigningSecret,
}: {
  md: string
  paymentsTokenSigningSecret: string
}): MdNormalised => {
  const jwtMd = Buffer.from(md, 'base64').toString('utf-8')

  const payload = MdSerializedSchema.parse(
    verify(jwtMd, paymentsTokenSigningSecret),
  )

  return {
    correlationId: payload.c,
    issuedAt: payload.iat,
  }
}

export type CardChargeInfo = {
  maskedCardNumber: string
  authorizationCode: string
  cardScheme: string
  cardUsage?: string
}

export const generateCardChargeFJSPayload = ({
  paymentFlow,
  charges,
  cardChargeInfo,
  totalPrice,
  systemId,
  merchantReferenceData,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  cardChargeInfo: CardChargeInfo
  totalPrice: number
  systemId: string
  merchantReferenceData: string
}): Charge => {
  return generateChargeFJSPayload({
    paymentFlow,
    charges,
    systemId,
    payInfo: {
      PAN: cardChargeInfo.maskedCardNumber,
      RRN: merchantReferenceData,
      authCode: cardChargeInfo.authorizationCode,
      cardType: cardChargeInfo.cardScheme,
      payableAmount: totalPrice,
      paymentMeans: cardChargeInfo.cardUsage?.toLowerCase()?.startsWith('d')
        ? PayInfoPaymentMeansEnum.Debetkort
        : PayInfoPaymentMeansEnum.Kreditkort,
    },
  })
}

export const generateApplePayRequestHeaders = (
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway'],
) => {
  const { paymentsApiSecret, paymentsApiHeaderKey, paymentsApiHeaderValue } =
    paymentApiConfig

  return {
    'Content-Type': 'application/json',
    Authorization: paymentsApiSecret,
    [paymentsApiHeaderKey]: paymentsApiHeaderValue,
  }
}

export const validateAndParseApplePayValidationUrl = (
  validationURL: string,
): URL => {
  let parsed: URL

  try {
    parsed = new URL(validationURL)
  } catch {
    throw new Error('Invalid Apple Pay validation URL')
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Apple Pay validation URL must use HTTPS')
  }

  const host = parsed.hostname.toLowerCase()
  if (
    !APPLE_PAY_ALLOWED_VALIDATION_HOSTS.some(
      (allowed) => host === allowed.toLowerCase(),
    )
  ) {
    throw new Error(
      `Apple Pay validation URL host "${host}" is not in the allowlist`,
    )
  }

  return parsed
}

/** Decrypt Apple Pay payment token to get card data for Valitor DecryptedPaymentTokenData flow */
export const decryptApplePayPaymentToken = ({
  paymentData,
  paymentProcessingKey,
}: {
  paymentData: {
    version: string
    data: string
    signature: string
    header: {
      ephemeralPublicKey: string
      publicKeyHash: string
      transactionId: string
    }
  }
  paymentProcessingKey: string
}): {
  cardNumber: string
  expirationMonth: number
  expirationYear: number
  paymentCryptogram: string
} => {
  if (paymentData.version !== 'EC_v1') {
    throw new Error(
      `Unsupported Apple Pay token version: ${paymentData.version}. Only EC_v1 is supported.`,
    )
  }

  const encryptedData = Buffer.from(paymentData.data, 'base64')

  const ecdh = crypto.createECDH('prime256v1')
  const privateKeyBytes = Uint8Array.from(
    Buffer.from(paymentProcessingKey, 'utf8'),
  )
  ecdh.setPrivateKey(privateKeyBytes)

  const ephemeralPublicKey = Uint8Array.from(
    Buffer.from(paymentData.header.ephemeralPublicKey, 'base64'),
  )
  const sharedSecret = ecdh.computeSecret(ephemeralPublicKey)
  const sharedSecretBytes = Uint8Array.from(sharedSecret)

  const aesKey = Uint8Array.from(
    crypto.createHash('sha256').update(sharedSecretBytes).digest(),
  )

  const iv = Uint8Array.from(Buffer.alloc(16, 0))
  const authTag = Uint8Array.from(encryptedData.subarray(-16))
  const ciphertext = Uint8Array.from(encryptedData.subarray(0, -16))

  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv)
  decipher.setAuthTag(authTag)

  const plainPart1 = new Uint8Array(decipher.update(ciphertext))
  const plainPart2 = new Uint8Array(decipher.final())
  const plain = new Uint8Array(plainPart1.length + plainPart2.length)
  plain.set(plainPart1, 0)
  plain.set(plainPart2, plainPart1.length)
  const decrypted = new TextDecoder('utf-8').decode(plain)

  const parsed = JSON.parse(decrypted) as {
    applicationPrimaryAccountNumber: string
    applicationExpirationDate: string
    paymentData?: {
      onlinePaymentCryptogram: string
      eciIndicator?: string
    }
  }

  const expirationStr = parsed.applicationExpirationDate
  const expirationYear = 2000 + parseInt(expirationStr.slice(0, 2), 10)
  const expirationMonth = parseInt(expirationStr.slice(2, 4), 10)

  const paymentCryptogram = parsed.paymentData?.onlinePaymentCryptogram ?? ''
  if (!paymentCryptogram) {
    throw new Error('Apple Pay decrypted token missing onlinePaymentCryptogram')
  }

  return {
    cardNumber: parsed.applicationPrimaryAccountNumber,
    expirationMonth,
    expirationYear,
    paymentCryptogram,
  }
}

export const generateApplePayValidationRequestOptions = ({
  validationURL,
  merchantIdentifier,
  displayName,
  initiativeContext,
  merchantIdentityCert,
  merchantIdentityKey,
}: {
  validationURL: string
  merchantIdentifier: string
  displayName: string
  initiativeContext: string
  merchantIdentityCert: string
  merchantIdentityKey: string
}): RequestInit & { dispatcher?: Agent } => {
  validateAndParseApplePayValidationUrl(validationURL)

  const body = JSON.stringify({
    merchantIdentifier,
    displayName,
    initiative: 'web',
    initiativeContext,
  })

  // undici Agent enables mTLS (client cert + key) for fetch - required by Apple Pay validation
  const dispatcher = new Agent({
    connect: {
      cert: merchantIdentityCert,
      key: merchantIdentityKey,
    },
  })

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
    },
    body,
    dispatcher,
  }
}

/** Valitor WalletPayment with DecryptedPaymentTokenData (merchant-decrypted flow) */
export const generateApplePayDecryptedChargeRequestOptions = ({
  decryptedData,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  decryptedData: {
    cardNumber: string
    expirationMonth: number
    expirationYear: number
    paymentCryptogram: string
  }
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { systemCalling } = paymentApiConfig

  const body: ApplePayDecryptedWalletPaymentPayload = {
    operation: 'Sale',
    walletPaymentType: 'ApplePay',
    applePayWalletPayment: {
      decryptedPaymentTokenData: {
        amount: String(iskToAur(amount)),
        cardNumber: decryptedData.cardNumber,
        currency: 'ISK',
        expirationMonth: decryptedData.expirationMonth,
        expirationYear: decryptedData.expirationYear,
        paymentCryptogram: decryptedData.paymentCryptogram,
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
    headers: generateApplePayRequestHeaders(paymentApiConfig),
    body: JSON.stringify(body),
  }
}

/** Masks all but the last 4 digits for safe logging */
export const redactCardNumber = (cardNumber: string): string => {
  if (cardNumber.length <= 4) return '****'
  return '*'.repeat(cardNumber.length - 4) + cardNumber.slice(-4)
}
