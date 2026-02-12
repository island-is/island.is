import { Charge } from '@island.is/clients/charge-fjs-v2'
import { PaymentFlowAttributes } from '../app/paymentFlow/models/paymentFlow.model'
import { CatalogItemWithQuantity } from '../types/charges'
import { FjsErrorCode } from '@island.is/shared/constants'

type PayInfo = Charge['payInfo']

export interface GenerateChargeFJSPayloadInput {
  paymentFlow: Pick<
    PaymentFlowAttributes,
    | 'payerNationalId'
    | 'organisationId'
    | 'id'
    | 'extraData'
    | 'chargeItemSubjectId'
  >
  charges: Pick<
    CatalogItemWithQuantity,
    'chargeType' | 'priceAmount' | 'chargeItemCode' | 'quantity'
  >[]
  systemId: string
  payInfo?: PayInfo // If this is skipped, then the charge will create an invoice
  returnUrl?: string
}

export const generateChargeFJSPayload = ({
  paymentFlow,
  charges,
  systemId,
  payInfo,
  returnUrl = '',
}: GenerateChargeFJSPayloadInput): Charge => {
  const chargeItemSubjectId = paymentFlow.chargeItemSubjectId
    ? paymentFlow.chargeItemSubjectId
    : paymentFlow.id

  return {
    // Unique id for the charge, no longer than 22 characters
    chargeItemSubject: chargeItemSubjectId.substring(0, 22),
    chargeType: charges[0].chargeType,
    charges: charges.map((charge) => ({
      amount: charge.priceAmount * charge.quantity,
      chargeItemCode: charge.chargeItemCode,
      priceAmount: charge.priceAmount,
      quantity: charge.quantity,
      // Reference id, empty for now
      reference: '',
    })),
    immediateProcess: true,
    payeeNationalID: paymentFlow.payerNationalId,
    performerNationalID: paymentFlow.payerNationalId,
    performingOrgID: paymentFlow.organisationId,
    requestID: paymentFlow.id,
    systemID: systemId,
    payInfo,
    returnUrl,
    extraData: paymentFlow.extraData,
  }
}

interface FjsError {
  message?: string
  body?: {
    error?: {
      code?: number
      message?: string
    }
  }
}

export const mapFjsErrorToCode = (
  e: FjsError,
  onlyKnownCode = false,
): FjsErrorCode | null => {
  const message = e?.body?.error?.message ?? e.message ?? 'Unknown error'
  return fjsErrorMessageToCode(message, onlyKnownCode)
}

export const fjsErrorMessageToCode = (
  message: string,
  onlyKnownCode = false,
): FjsErrorCode | null => {
  if (message.startsWith('Búið að taka á móti álagningu')) {
    return FjsErrorCode.AlreadyCreatedCharge
  }

  if (onlyKnownCode) {
    return null
  }

  return FjsErrorCode.FailedToCreateCharge
}

/** Message used when FJS request failed due to network/transient error (no FJS response). */
export const FJS_NETWORK_ERROR = 'FJS_NETWORK_ERROR'

const NETWORK_ERROR_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ENETUNREACH',
  'EAI_AGAIN',
])

/**
 * Returns true if the error is a network/transient error (no response from FJS).
 * In that case the worker should not record a failure event and will retry on the next run.
 */
export const isNetworkError = (e: unknown): boolean => {
  const err = e as { code?: string }
  return Boolean(err?.code && NETWORK_ERROR_CODES.has(err.code))
}
