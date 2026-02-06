import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'

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
} from './cardPayment.types'

import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { CardPaymentModuleConfigType } from './cardPayment.config'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import { CatalogItemWithQuantity } from '../../types/charges'
import {
  CardPaymentResponse,
  PaymentTrackingData,
  ApplePayPaymentInput,
} from '../../types'
import { ApplePayChargeInput } from './dtos'

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
  chargeResponse: {
    acquirerReferenceNumber: string
    authorizationCode: string
    cardScheme: string
    maskedCardNumber: string
    cardUsage: string
  }
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
      cardType: chargeResponse.cardScheme,
      payableAmount: totalPrice,
      paymentMeans: chargeResponse.cardUsage?.toLowerCase()?.startsWith('d')
        ? PayInfoPaymentMeansEnum.Debetkort
        : PayInfoPaymentMeansEnum.Kreditkort,
    },
    totalPrice,
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

export const generateApplePaySessionRequestOptions = ({
  domainName,
  displayName,
  paymentApiConfig,
}: {
  domainName: string
  displayName: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
}) => {
  return {
    method: 'POST',
    headers: generateApplePayRequestHeaders(paymentApiConfig),
    body: JSON.stringify({
      domainName,
      displayName,
    }),
  }
}

export const generateApplePayChargeRequestOptions = ({
  input,
  paymentApiConfig,
  paymentTrackingData,
}: {
  input: ApplePayChargeInput
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
}) => {
  const { systemCalling } = paymentApiConfig

  const body: ApplePayPaymentInput = {
    Operation: 'Sale',
    WalletPaymentType: 'ApplePay',
    ApplePayWalletPayment: {
      PaymentToken: {
        PaymentData: {
          Version: input.paymentData.version,
          Data: input.paymentData.data,
          Signature: input.paymentData.signature,
          Header: {
            EphemeralPublicKey: input.paymentData.header.ephemeralPublicKey,
            PublicKeyHash: input.paymentData.header.publicKeyHash,
            TransactionId: input.paymentData.header.transactionId,
          },
        },
        PaymentMethod: {
          DisplayName: input.paymentMethod.displayName,
          Network: input.paymentMethod.network,
        },
        TransactionIdentifier: input.transactionIdentifier,
      },
    },
    paymentAdditionalData: {
      merchantReferenceData: paymentTrackingData.merchantReferenceData,
    },
    systemCalling,
    correlationId: paymentTrackingData.correlationId,
  }

  return {
    method: 'POST',
    headers: generateApplePayRequestHeaders(paymentApiConfig),
    body: JSON.stringify(body),
  }
}

export const generateRefundWithCorrelationIdRequestOptions = ({
  paymentApiConfig,
  paymentTrackingData,
}: {
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
}) => {
  const { systemCalling } = paymentApiConfig

  const body = {
    originalCorrelationId: paymentTrackingData.correlationId,
    originalTransactionDate: paymentTrackingData.paymentDate.toISOString(),
    systemCalling: systemCalling,
  }

  return {
    method: 'POST',
    headers: generateApplePayRequestHeaders(paymentApiConfig),
    body: JSON.stringify(body),
  }
}

export const generatePaymentChargeFJSPayload = ({
  paymentFlow,
  catalogItems,
  paymentResult,
  totalPrice,
  systemId,
  merchantReferenceData,
}: {
  paymentFlow: PaymentFlowAttributes
  catalogItems: CatalogItemWithQuantity[]
  paymentResult: CardPaymentResponse
  totalPrice: number
  systemId: string
  merchantReferenceData: string
}) => {
  return generateChargeFJSPayload({
    paymentFlow,
    charges: catalogItems,
    systemId,
    totalPrice,
    payInfo: {
      PAN: paymentResult.maskedCardNumber,
      RRN: merchantReferenceData,
      authCode: paymentResult.authorizationCode,
      cardType: paymentResult.cardInformation.cardScheme,
      payableAmount: totalPrice,
      paymentMeans: paymentResult.cardInformation.cardUsage
        ?.toLowerCase()
        ?.startsWith('d')
        ? PayInfoPaymentMeansEnum.Debetkort
        : PayInfoPaymentMeansEnum.Kreditkort,
    },
  })
}
