import { z } from 'zod'

import { PaymentStatus } from '../../types'
import { CatalogItemWithQuantity } from '../../types/charges'

/** Normalized bank-transfer status used internally and on the wire. */
export enum BankTransferStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

/** Failure subset of BankTransferStatus surfaced on the GetPaymentFlow response. */
export enum BankTransferFailureReason {
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

/** True for any status that won't change again (SUCCESS and the three failure values). */
export const isTerminalBankTransferStatus = (
  status: BankTransferStatus,
): boolean => status !== BankTransferStatus.PENDING

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

export const blikkCreatePaymentResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  scaRedirectUrl: z.string().optional(),
  message: z.string().optional(),
  partnerRedirectUrl: z.string().optional(),
})

export const blikkGetPaymentResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  scaRedirectUrl: z.string().optional(),
  message: z.string().optional(),
})
