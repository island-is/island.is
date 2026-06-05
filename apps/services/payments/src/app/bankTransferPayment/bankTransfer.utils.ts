import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'
import { BlikkItem } from '@island.is/clients/blikk'

import {
  BankTransferFailureReason,
  BankTransferStatus,
} from './bankTransfer.types'
import { BankTransferPayment } from './models/bankTransferPayment.model'
import { CatalogItemWithQuantity } from '../../types/charges'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { generateChargeFJSPayload } from '../../utils/fjsCharge'

/** Blikk's payment status lifecycle. */
export const BLIKK_STATUSES = [
  'DRAFT',
  'PENDING',
  'SCA_REQUIRED',
  'SCA_COMPLETE',
  'SUCCESS',
  'ERROR',
  'REJECTED',
  'CANCELLED',
] as const

export const isBlikkStatus = (status: string): boolean =>
  (BLIKK_STATUSES as readonly string[]).includes(status)

/** Map a raw Blikk status onto the normalized status. Unknown → PENDING (keep polling). */
export const mapBlikkStatusToBankTransferStatus = (
  status: string,
): BankTransferStatus => {
  switch (status) {
    case 'SUCCESS':
      return BankTransferStatus.SUCCESS
    case 'ERROR':
      return BankTransferStatus.ERROR
    case 'REJECTED':
      return BankTransferStatus.REJECTED
    case 'CANCELLED':
      return BankTransferStatus.CANCELLED
    case 'DRAFT':
    case 'PENDING':
    case 'SCA_REQUIRED':
    case 'SCA_COMPLETE':
    default:
      return BankTransferStatus.PENDING
  }
}

export const toBlikkItem = (item: CatalogItemWithQuantity): BlikkItem => ({
  name: item.chargeItemName,
  quantity: item.quantity,
  unitPrice: String(item.priceAmount),
  sku: item.chargeItemCode,
})

/** True when the row's TTL has elapsed. Anchored on `expires_at`, which we sent to Blikk on create. */
export const isRowExpired = (
  row: Pick<BankTransferPayment, 'expiresAt'>,
): boolean => row.expiresAt.getTime() < Date.now()

/** Structured log prefix used throughout the bank-transfer flow. */
export const createLogPrefix = (
  paymentFlowId: string,
  correlationId: string,
  providerPaymentId: string,
): string =>
  `[${paymentFlowId}][correlationId: ${correlationId}][rrn: ${providerPaymentId}]`

/** Row-driven convenience wrapper around `createLogPrefix`. */
export const rowLogPrefix = (
  row: Pick<
    BankTransferPayment,
    'paymentFlowId' | 'sourceReferenceId' | 'providerPaymentId'
  >,
): string =>
  createLogPrefix(
    row.paymentFlowId,
    row.sourceReferenceId,
    row.providerPaymentId,
  )

/** True for ERROR / REJECTED / CANCELLED (distinct from `isTerminalBankTransferStatus` which includes SUCCESS). */
export const isBankTransferFailureStatus = (
  status: BankTransferStatus,
): boolean =>
  status === BankTransferStatus.ERROR ||
  status === BankTransferStatus.REJECTED ||
  status === BankTransferStatus.CANCELLED

/** Narrows BankTransferStatus to its failure subset. Returns null for SUCCESS/PENDING. */
export const toBankTransferFailureReason = (
  status: BankTransferStatus,
): BankTransferFailureReason | null => {
  switch (status) {
    case BankTransferStatus.ERROR:
      return BankTransferFailureReason.ERROR
    case BankTransferStatus.REJECTED:
      return BankTransferFailureReason.REJECTED
    case BankTransferStatus.CANCELLED:
      return BankTransferFailureReason.CANCELLED
    default:
      return null
  }
}

/** Builds a PAID FJS charge payload for a settled bank transfer; carries the provider id in `RRN`. */
export const generateBankTransferChargeFJSPayload = ({
  paymentFlow,
  charges,
  totalPrice,
  systemId,
  providerPaymentId,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  totalPrice: number
  systemId: string
  providerPaymentId: string
}): Charge =>
  generateChargeFJSPayload({
    paymentFlow,
    charges,
    systemId,
    payInfo: {
      RRN: providerPaymentId,
      payableAmount: totalPrice,
      paymentMeans: PayInfoPaymentMeansEnum.Milli,
    },
  })
