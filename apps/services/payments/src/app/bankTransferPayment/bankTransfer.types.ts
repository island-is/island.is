import { PaymentStatus } from '../../types'
import { CatalogItemWithQuantity } from '../../types/charges'

/** Normalized bank-transfer status. */
export enum BankTransferStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum BankTransferFailureReason {
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

export interface CreateBankTransferPaymentInput {
  amount: number
  currency: string
  paymentFlowId: string
  // Per-attempt idempotency key sent to the provider — distinct from paymentFlowId to allow retries.
  correlationId: string
  callbackUrl?: string
  partnerRedirectUrl?: string
  source?: string
  items?: CatalogItemWithQuantity[]
  // Unix seconds.
  expiresAt?: number
}

export interface BankTransferPaymentResult {
  providerPaymentId: string
  // Raw provider status, persisted verbatim to `last_known_status`.
  rawStatus: string
  status: BankTransferStatus
  // Empty / undefined = back-channel SCA, no redirect.
  scaRedirectUrl?: string
  message?: string
}

/** Bank-transfer overlay folded into GetPaymentFlow when the base status is UNPAID. */
export interface BankTransferStatusOverlay {
  paymentStatus:
    | PaymentStatus.BANK_TRANSFER_PENDING
    | PaymentStatus.BANK_TRANSFER_FAILED
  updatedAt: Date
  bankTransferScaRedirectUrl?: string
  lastBankTransferFailure?: BankTransferFailureReason
  // Row TTL; drives the FE polling hard timeout.
  bankTransferExpiresAt?: Date
}
