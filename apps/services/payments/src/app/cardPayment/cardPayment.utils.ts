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

/**
 * NIST SP 800-56A single-step key derivation (Concat KDF) with SHA-256 for EC_v1, as described under
 * “Restore a symmetric key for ECC” in PassKit (ECDH shared secret + KDF inputs).
 *
 * Aligns with Apple’s table: hash **Z** = SHA-256; **Party U Info** = ASCII `"Apple"`;
 * **Party V Info** = SHA-256 of the merchant ID string literal (same value as `APPLE_PAY_MERCHANT_IDENTIFIER`),
 * per [Restoring the symmetric key](https://developer.apple.com/documentation/passkit/restoring-the-symmetric-key).
 *
 * **FixedInfo** uses the `id-aes256-GCM` algorithm id prefix (length octet + ASCII) before Party U/V, matching
 * common SP 800-56A Concat deployments for AES-256-GCM (see also Payment Token Format Reference, step 4).
 *
 * @see https://developer.apple.com/documentation/passkit/restoring-the-symmetric-key
 * @see https://developer.apple.com/documentation/passkit/payment-token-format-reference
 */
/** Exported for unit tests and callers that need the same KDF as PassKit EC_v1 decryption. */
export const deriveApplePaySymmetricKey = (
  sharedSecret: Buffer,
  merchantIdentifier: string,
): Buffer => {
  const counter = new Uint8Array(4)
  counter[0] = 0
  counter[1] = 0
  counter[2] = 0
  counter[3] = 1

  const algorithmId = Uint8Array.from([
    0x0d,
    ...Buffer.from('id-aes256-GCM', 'ascii'),
  ])
  const partyUInfo = Uint8Array.from(Buffer.from('Apple', 'ascii'))
  const partyVInfo = Uint8Array.from(
    crypto.createHash('sha256').update(merchantIdentifier, 'utf8').digest(),
  )

  const fixedInfo = new Uint8Array(
    algorithmId.length + partyUInfo.length + partyVInfo.length,
  )
  fixedInfo.set(algorithmId, 0)
  fixedInfo.set(partyUInfo, algorithmId.length)
  fixedInfo.set(partyVInfo, algorithmId.length + partyUInfo.length)

  return crypto
    .createHash('sha256')
    .update(counter)
    .update(Uint8Array.from(sharedSecret))
    .update(fixedInfo)
    .digest()
}

/**
 * Decrypt Apple Pay `EC_v1` payment data for the gateway (e.g. Valitor `DecryptedPaymentTokenData`).
 *
 * Implements PassKit flow: ECDH (id-ecDH) with Payment Processing private key + ephemeral public key (SPKI),
 * then symmetric key restoration and AES-256-GCM decrypt per
 * [Restoring the symmetric key](https://developer.apple.com/documentation/passkit/restoring-the-symmetric-key)
 * and [Payment token format reference](https://developer.apple.com/documentation/passkit/payment-token-format-reference).
 */
export const decryptApplePayPaymentToken = ({
  paymentData,
  paymentProcessingKey,
  merchantIdentifier,
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
  /** PEM-encoded EC private key (Apple Payment Processing) */
  paymentProcessingKey: string
  /** Merchant ID string (e.g. merchant.com.example) — used for KDF Party V Info */
  merchantIdentifier: string
}): {
  cardNumber: string
  expirationMonth: number
  expirationYear: number
  paymentCryptogram: string
} => {
  if (paymentData.version !== 'EC_v1') {
    throw new Error(
      `Apple Pay decrypt [stage=version-check] unsupported token version: ${paymentData.version}. Only EC_v1 is supported.`,
    )
  }

  const encryptedData = Buffer.from(paymentData.data, 'base64')

  let privateKey: crypto.KeyObject
  try {
    privateKey = crypto.createPrivateKey({
      key: paymentProcessingKey,
      format: 'pem',
    })
  } catch (e) {
    throw new Error(
      `Apple Pay decrypt [stage=load-processing-key] invalid PEM EC key: ${
        (e as Error).message
      }`,
    )
  }

  let ephemeralPublicKey: crypto.KeyObject
  try {
    const ephemeralDer = Buffer.from(
      paymentData.header.ephemeralPublicKey,
      'base64',
    )
    ephemeralPublicKey = crypto.createPublicKey({
      key: ephemeralDer,
      format: 'der',
      type: 'spki',
    })
  } catch (e) {
    throw new Error(
      `Apple Pay decrypt [stage=load-ephemeral-key] invalid SPKI ephemeral public key: ${
        (e as Error).message
      }`,
    )
  }

  let sharedSecret: Buffer
  try {
    sharedSecret = crypto.diffieHellman({
      privateKey,
      publicKey: ephemeralPublicKey,
    })
  } catch (e) {
    throw new Error(
      `Apple Pay decrypt [stage=ecdh] diffieHellman failed: ${
        (e as Error).message
      }`,
    )
  }

  const aesKey = Uint8Array.from(
    deriveApplePaySymmetricKey(sharedSecret, merchantIdentifier),
  )

  const iv = Uint8Array.from(Buffer.alloc(16, 0))
  const authTag = Uint8Array.from(encryptedData.subarray(-16))
  const ciphertext = Uint8Array.from(encryptedData.subarray(0, -16))

  let decrypted: string
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv)
    decipher.setAuthTag(authTag)
    const plainPart1 = new Uint8Array(decipher.update(ciphertext))
    const plainPart2 = new Uint8Array(decipher.final())
    const plain = new Uint8Array(plainPart1.length + plainPart2.length)
    plain.set(plainPart1, 0)
    plain.set(plainPart2, plainPart1.length)
    decrypted = new TextDecoder('utf-8').decode(plain)
  } catch (e) {
    // GCM auth-tag mismatch is the most common failure here — almost always
    // KDF input divergence (wrong merchantIdentifier as Party V) or the
    // wrong processing key.
    throw new Error(
      `Apple Pay decrypt [stage=aes-gcm] decipher failed (likely wrong key or merchantIdentifier): ${
        (e as Error).message
      }`,
    )
  }

  let parsed: {
    applicationPrimaryAccountNumber: string
    applicationExpirationDate: string
    paymentData?: {
      onlinePaymentCryptogram: string
      eciIndicator?: string
    }
  }
  try {
    parsed = JSON.parse(decrypted)
  } catch (e) {
    throw new Error(
      `Apple Pay decrypt [stage=parse-plaintext] decrypted payload is not valid JSON: ${
        (e as Error).message
      }`,
    )
  }

  const expirationStr = parsed.applicationExpirationDate
  const expirationYear = 2000 + parseInt(expirationStr.slice(0, 2), 10)
  const expirationMonth = parseInt(expirationStr.slice(2, 4), 10)

  const paymentCryptogram = parsed.paymentData?.onlinePaymentCryptogram ?? ''
  if (!paymentCryptogram) {
    throw new Error(
      'Apple Pay decrypt [stage=extract-fields] decrypted token missing onlinePaymentCryptogram',
    )
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
  dispatcher,
}: {
  validationURL: string
  merchantIdentifier: string
  displayName: string
  initiativeContext: string
  /** mTLS-configured undici Agent — caller is responsible for memoizing across requests */
  dispatcher: Agent
}): RequestInit & { dispatcher?: Agent } => {
  validateAndParseApplePayValidationUrl(validationURL)

  const body = JSON.stringify({
    merchantIdentifier,
    displayName,
    initiative: 'web',
    initiativeContext,
  })

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
    },
    redirect: 'error',
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
