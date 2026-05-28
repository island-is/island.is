import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'

import { BankTransferStatus } from './bankTransfer.types'
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

/** Blikk line item shape. */
export interface BlikkItem {
  name: string
  quantity: number
  unitPrice: string
  description?: string
  sku?: string
}

export const toBlikkItem = (item: CatalogItemWithQuantity): BlikkItem => ({
  name: item.chargeItemName,
  quantity: item.quantity,
  unitPrice: String(item.priceAmount),
  sku: item.chargeItemCode,
})

/**
 * Builds the FJS charge payload for a settled bank transfer. Mirrors `generateCardChargeFJSPayload`:
 * a PAID charge (`payInfo` present). The card-only `payInfo` fields are omitted; the provider payment id
 * is carried in `RRN` so FJS can reconcile the transfer.
 *
 * Depends on the FJS `payInfo` contract change (transfer `paymentMeans` + optional card fields). FJS will
 * deploy the matching backend change and the generated client (`gen/`) will be regenerated before this
 * feature goes live.
 */
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
      paymentMeans: PayInfoPaymentMeansEnum.Millifaersla,
    },
  })
