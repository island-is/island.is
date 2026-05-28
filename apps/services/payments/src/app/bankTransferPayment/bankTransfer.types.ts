import { z } from 'zod'

import { CatalogItemWithQuantity } from '../../types/charges'

/** Normalized status the rest of the service and the frontend work with. */
export enum BankTransferStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

/** PENDING is the only non-terminal state; everything else is final. */
export const isTerminalBankTransferStatus = (
  status: BankTransferStatus,
): boolean => status !== BankTransferStatus.PENDING

export interface CreateBankTransferPaymentInput {
  // Amount in the smallest currency unit (e.g. ISK).
  amount: number
  currency: string
  // Our payment flow id — used for correlation/logging and the partner redirect URL; NOT the provider
  // idempotency key. See `sourceReferenceId`.
  paymentFlowId: string
  // Per-attempt idempotency key sent to the provider — fresh per attempt so that retries after a
  // terminal failure are not blocked by the provider's idempotency cache. The caller (the create
  // controller) generates this; we use the `bank_transfer_payment.id` row UUID for it.
  correlationId: string
  // Webhook target the provider calls on status updates.
  callbackUrl?: string
  // Where the provider returns the user after SCA.
  partnerRedirectUrl?: string
  // Optional merchant-defined source identifier.
  source?: string
  items?: CatalogItemWithQuantity[]
  // Unix timestamp (seconds) after which the payment expires.
  expiresAt?: number
}

export interface BankTransferPaymentResult {
  // The provider's payment id.
  providerPaymentId: string
  // The provider's raw status string, persisted to `bank_transfer_payment.last_known_status`.
  rawStatus: string
  // Normalized status used for branching and surfaced to the frontend.
  status: BankTransferStatus
  // URL to redirect the user to for SCA. can be empty. FE should not redirect if this is empty.
  scaRedirectUrl?: string
  // Provider message (e.g. error detail), if any.
  message?: string
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
