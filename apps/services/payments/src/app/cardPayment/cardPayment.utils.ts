import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'

import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'
import {
  CardErrorCode,
  MdNormalised,
  MdSerialized,
  SavedVerificationCompleteData,
} from './cardPayment.types'

const removeHyphensFromUUID = (uuid: string) => {
  return uuid.replace(/-/g, '')
}

const addHyphensToUUID = (uuid: string) => {
  if (uuid.length !== 32) {
    throw new Error('Invalid UUID format. Must be 32 characters long.')
  }

  // Add hyphens at the appropriate positions
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(
    12,
    16,
  )}-${uuid.slice(16, 20)}-${uuid.slice(20)}`
}

const MdSerializedSchema = z.object({
  c: z.string().length(32, 'Correlation ID must be 32 characters long'),
  pi: z.string().length(32, 'Payment flow ID must be 32 characters long'),
  a: z.number(),
  iat: z.number(),
})

export const generateMd = ({
  correlationId,
  paymentFlowId,
  amount,
  paymentsTokenSigningSecret,
  paymentsTokenSigningAlgorithm,
  paymentsTokenSignaturePrefix,
}: {
  correlationId: string
  paymentFlowId: string
  amount: number
  paymentsTokenSigningSecret: string
  paymentsTokenSigningAlgorithm: string
  paymentsTokenSignaturePrefix: string
}) => {
  const mdSerialized: Omit<MdSerialized, 'iat'> = {
    // Had to reduce the size of the UUIDs to 32 characters
    // to fit within the character limit of the md object
    c: removeHyphensFromUUID(correlationId),
    pi: removeHyphensFromUUID(paymentFlowId),
    a: amount,
  }

  const mdToken = sign(mdSerialized, paymentsTokenSigningSecret, {
    algorithm: paymentsTokenSigningAlgorithm as Algorithm,
  })

  const md = Buffer.from(
    mdToken.replace(paymentsTokenSignaturePrefix, ''),
  ).toString('base64')

  return md
}

interface PaymentApiConfig {
  paymentsApiSecret: string
  paymentsApiHeaderKey: string
  paymentsApiHeaderValue: string
}

export const generateVerificationRequestOptions = ({
  verifyCardInput,
  md,
  paymentApiConfig,
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: PaymentApiConfig
}) => {
  const {
    cardNumber,
    expiryMonth,
    expiryYear,
    amount,
    verificationCallbackUrl,
  } = verifyCardInput
  const { paymentsApiSecret, paymentsApiHeaderKey, paymentsApiHeaderValue } =
    paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cardholderDeviceType: 'WWW',
      amount: amount * 100, // Convert to ISK (aurar)
      currency: 'ISK',
      authenticationUrl: verificationCallbackUrl,
      MD: md,
      systemCalling: 'TODO', // TODO
    }),
  }

  return requestOptions
}

export const generateChargeRequestOptions = ({
  chargeCardInput,
  verificationData,
  paymentApiConfig,
}: {
  chargeCardInput: ChargeCardInput
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: PaymentApiConfig
}) => {
  const { cardNumber, expiryMonth, expiryYear, cvc, amount } = chargeCardInput
  const { paymentsApiSecret, paymentsApiHeaderKey, paymentsApiHeaderValue } =
    paymentApiConfig

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
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
      currency: 'ISK',
      amount: amount * 100, // Convert to ISK (aurar)
      systemCalling: 'TODO',
      cardVerificationData: verificationData,
    }),
  }

  return requestOptions
}

export const getPayloadFromMd = ({
  md,
  paymentsTokenSignaturePrefix,
  paymentsTokenSigningSecret,
}: {
  md: string
  paymentsTokenSignaturePrefix: string
  paymentsTokenSigningSecret: string
}): MdNormalised => {
  const jwtMd = `${paymentsTokenSignaturePrefix}${Buffer.from(
    md,
    'base64',
  ).toString('utf-8')}`

  const payload = MdSerializedSchema.parse(
    verify(jwtMd, paymentsTokenSigningSecret),
  )

  return {
    // Had to reduce the size of the UUIDs to 32 characters
    // to fit within the character limit of the md object
    correlationId: addHyphensToUUID(payload.c),
    paymentFlowId: addHyphensToUUID(payload.pi),
    amount: payload.a,
    issuedAt: payload.iat,
  }
}

export function mapToCardErrorCode(originalCode: string): CardErrorCode {
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
    default: CardErrorCode.GenericDecline,
  }

  // Return the mapped value or the default
  return errorCodeMap[originalCode] || CardErrorCode.GenericDecline
}
