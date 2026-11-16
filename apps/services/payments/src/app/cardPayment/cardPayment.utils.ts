import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'

import { PaymentFlowAttributes } from '../paymentFlow/models'
import { CardPaymentModuleConfigType } from './cardPayment.config'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'
import type { FjsPayInfo } from '../../utils/fjsDebtPayment'
import { CatalogItemWithQuantity } from '../../types/charges'

export const iskToAur = (amount: number) => amount * 100

export const generateWalletPaymentRequestHeaders = (
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

export type CardChargeInfo = {
  maskedCardNumber: string
  authorizationCode: string
  cardScheme: string
  cardUsage?: string
}

/** The neutral payInfo of a card payment, shared by the FJS charge and debt payment clients. */
export const buildCardPayInfo = ({
  cardChargeInfo,
  totalPrice,
  merchantReferenceData,
  correlationId,
}: {
  cardChargeInfo: CardChargeInfo
  totalPrice: number
  merchantReferenceData: string
  correlationId: string
}): FjsPayInfo & { PAN: string; authCode: string; cardType: string } => ({
  kind: cardChargeInfo.cardUsage?.toLowerCase()?.startsWith('d')
    ? 'debit'
    : 'credit',
  PAN: cardChargeInfo.maskedCardNumber,
  RRN: merchantReferenceData,
  authCode: cardChargeInfo.authorizationCode,
  cardType: cardChargeInfo.cardScheme,
  payableAmount: totalPrice,
  correlationId,
})

export const generateCardChargeFJSPayload = ({
  paymentFlow,
  charges,
  cardChargeInfo,
  totalPrice,
  systemId,
  merchantReferenceData,
  correlationId,
  effectiveDate,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  cardChargeInfo: CardChargeInfo
  totalPrice: number
  systemId: string
  merchantReferenceData: string
  correlationId: string
  effectiveDate?: Date
}): Charge => {
  const { kind, ...payInfo } = buildCardPayInfo({
    cardChargeInfo,
    totalPrice,
    merchantReferenceData,
    correlationId,
  })

  return generateChargeFJSPayload({
    paymentFlow,
    charges,
    systemId,
    effectiveDate,
    payInfo: {
      ...payInfo,
      paymentMeans:
        kind === 'debit'
          ? PayInfoPaymentMeansEnum.Debetkort
          : PayInfoPaymentMeansEnum.Kreditkort,
    },
  })
}
