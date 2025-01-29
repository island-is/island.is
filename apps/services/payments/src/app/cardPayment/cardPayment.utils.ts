import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'

import {
  CatalogItem,
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'

import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'
import {
  CardErrorCode,
  ChargeResponse,
  MdNormalised,
  MdSerialized,
  SavedVerificationCompleteData,
} from './cardPayment.types'

import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CardPaymentModuleConfigType } from './cardPayment.config'

const MdSerializedSchema = z.object({
  c: z.string().length(36, 'Correlation ID must be 36 characters long'),
  iat: z.number(),
})

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
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
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
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cardholderDeviceType: 'WWW',
      amount: amount * 100, // Convert to ISK (aurar)
      currency: 'ISK',
      authenticationUrl: `${environment.paymentsWeb.origin}/api/card/callback`,
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
}: {
  chargeCardInput: ChargeCardInput
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
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
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
      currency: 'ISK',
      amount: amount * 100, // Convert to ISK (aurar)
      systemCalling,
      cardVerificationData: verificationData,
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

export const generateCardChargeFJSPayload = ({
  paymentFlow,
  charges,
  chargeResponse,
  paymentApiConfig,
  totalPrice,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItem[]
  chargeResponse: ChargeResponse
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  totalPrice: number
}): Charge => {
  return {
    chargeItemSubject: paymentFlow.productTitle ?? charges[0].chargeItemName,
    chargeType: charges[0].chargeType,
    charges: charges.map((charge) => ({
      amount: charge.priceAmount,
      chargeItemCode: charge.chargeItemCode,
      priceAmount: charge.priceAmount,
      quantity: charge.quantity ?? 1,
      reference: charge.chargeItemName,
    })),
    immediateProcess: true,
    payeeNationalID: paymentFlow.payerNationalId,
    performerNationalID: paymentFlow.payerNationalId,
    performingOrgID: paymentFlow.organisationId,
    requestID: paymentFlow.id,
    systemID: paymentApiConfig.systemCalling,
    payInfo: {
      PAN: chargeResponse.maskedCardNumber,
      RRN: chargeResponse.acquirerReferenceNumber,
      authCode: chargeResponse.authorizationCode,
      cardType: chargeResponse.cardInformation.cardScheme,
      payableAmount: totalPrice,
      paymentMeans: chargeResponse.cardInformation.cardUsage
        ?.toLowerCase()
        ?.startsWith('d')
        ? PayInfoPaymentMeansEnum.Debetkort
        : PayInfoPaymentMeansEnum.Kreditkort,
    },
    returnUrl: '',
  }
}
