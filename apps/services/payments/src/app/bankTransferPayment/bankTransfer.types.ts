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
  // Derived, not a raw provider value: an ERROR observed on a row past its TTL.
  EXPIRED = 'expired',
}

/** Provider-neutral sub-status of a pending attempt. */
export enum BankTransferPendingStatus {
  // SCA is outstanding — show a QR code (desktop) / open-banking-app button (mobile).
  SCA_REQUIRED = 'sca_required',
  // SCA complete or not yet required — show a waiting-for-confirmation message.
  PROCESSING = 'processing',
}

export interface CreateBankTransferPaymentInput {
  amount: number
  currency: string
  paymentFlowId: string
  // Per-attempt idempotency key sent to the provider — distinct from paymentFlowId to allow retries.
  correlationId: string
  callbackUrl?: string
  partnerRedirectUrl?: string
  items?: CatalogItemWithQuantity[]
  // Unix seconds.
  expiresAt?: number
  debtorExternalId?: string
  bankAccountNumber?: string
}

export interface BankTransferPaymentResult {
  providerPaymentId: string
  // Raw provider status, persisted verbatim to `last_known_status`.
  rawStatus: string
  status: BankTransferStatus
  // Empty / undefined = back-channel SCA, no redirect.
  scaRedirectUrl?: string
  message?: string
  // True when the payer must complete provider onboarding before SCA can proceed —
  // the one case where the FE still redirects to scaRedirectUrl.
  onboardingRequired?: boolean
}

/** Bank-transfer overlay folded into GetPaymentFlow when the base status is UNPAID. */
export interface BankTransferStatusOverlay {
  paymentStatus:
    | PaymentStatus.PAID
    | PaymentStatus.BANK_TRANSFER_PENDING
    | PaymentStatus.BANK_TRANSFER_FAILED
  updatedAt: Date
  bankTransferScaRedirectUrl?: string
  lastBankTransferFailure?: BankTransferFailureReason
  // Row TTL; drives the FE polling hard timeout.
  bankTransferExpiresAt?: Date
  bankTransferPendingStatus?: BankTransferPendingStatus
}
