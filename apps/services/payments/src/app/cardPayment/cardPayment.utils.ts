import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'

import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'
import { CardErrorCode } from '@island.is/shared/constants'

import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'
import {
  ChargeResponse,
  MdNormalised,
  MdSerialized,
  SavedVerificationCompleteData,
} from './cardPayment.types'

import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CardPaymentModuleConfigType } from './cardPayment.config'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { CatalogItemWithQuantity } from '../../types/charges'
import { PaymentTrackingData } from '../../types/cardPayment'

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
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  webOrigin: string
}) => {
  const { cardNumber, expiryMonth, expiryYear, amount } = verifyCardInput
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
}: {
  chargeCardInput: ChargeCardInput
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
}) => {
  const { cardNumber, expiryMonth, expiryYear, cvc, amount } = chargeCardInput
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
  charge,
  paymentApiConfig,
}: {
  amount: number
  cardNumber: string
  charge: ChargeResponse
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
      acquirerReferenceNumber: charge.acquirerReferenceNumber,
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
    default: CardErrorCode.GenericDecline,
  }

  // Return the mapped value or the default
  return errorCodeMap[firstTwoCharacters] || CardErrorCode.GenericDecline
}

export const generateCardChargeFJSPayload = ({
  paymentFlow,
  charges,
  chargeResponse,
  totalPrice,
  systemId,
  merchantReferenceData,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  chargeResponse: ChargeResponse
  totalPrice: number
  systemId: string
  merchantReferenceData: string
}): Charge => {
  return generateChargeFJSPayload({
    paymentFlow,
    charges,
    systemId,
    payInfo: {
      PAN: chargeResponse.maskedCardNumber,
      RRN: merchantReferenceData,
      authCode: chargeResponse.authorizationCode,
      cardType: chargeResponse.cardInformation.cardScheme,
      payableAmount: totalPrice,
      paymentMeans: chargeResponse.cardInformation.cardUsage
        ?.toLowerCase()
        ?.startsWith('d')
        ? PayInfoPaymentMeansEnum.Debetkort
        : PayInfoPaymentMeansEnum.Kreditkort,
    },
    totalPrice,
  })
}
