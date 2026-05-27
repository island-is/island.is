import { BankTransferStatus } from './bankTransfer.types'
import { CatalogItemWithQuantity } from '../../types/charges'

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

/** Blikk line item shape (note: unitPrice is a string, quantity an integer). */
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
