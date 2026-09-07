import {
  Charge,
  PayInfoPaymentMeansEnum,
} from '@island.is/clients/charge-fjs-v2'
import { BlikkItem } from '@island.is/clients/blikk'

import {
  BankTransferFailureReason,
  BankTransferStatus,
  BankTransferPendingStatus,
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

/** True when Blikk signals the payer must complete onboarding first: a DRAFT payment whose SCA URL points at the configured onboarding app. Compares parsed origins — an unparsable URL is never onboarding. */
export const isOnboardingRequired = (
  rawStatus: string,
  scaRedirectUrl: string | undefined,
  onboardingOrigin: string,
): boolean => {
  if (rawStatus !== 'DRAFT' || !scaRedirectUrl) {
    return false
  }
  try {
    return new URL(scaRedirectUrl).origin === new URL(onboardingOrigin).origin
  } catch {
    return false
  }
}

/**
 * Map a raw Blikk status onto the pending sub-status. Only `SCA_REQUIRED` asks the payer to act —
 * that is the point at which Blikk has decided whether there is an SCA URL to open at all, so an
 * earlier status is always "waiting", never "your turn".
 */
export const mapRawStatusToBankTransferPendingStatus = (
  status: string,
): BankTransferPendingStatus =>
  status === 'SCA_REQUIRED'
    ? BankTransferPendingStatus.SCA_REQUIRED
    : BankTransferPendingStatus.PROCESSING

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

/**
 * The identifiers every bank-transfer log line carries, as structured logger metadata rather than
 * interpolated into the message. Winston serialises these to top-level JSON fields in production
 * (`format.json()`), so Datadog reads them as attributes and the lifecycle can be joined on
 * `correlationId` (our per-attempt key) or `rrn` (the provider's payment id) with no Grok parsing.
 *
 * All three are required: a bank-transfer log line that cannot name its attempt is not joinable,
 * and a partially-filled context silently looks joinable while not being so. The call sites that
 * genuinely cannot supply all three log what they have under the same field names, leaving the
 * rest absent rather than placeheld — see `toResult` here and the refund saga.
 */
export type BankTransferLogContext = {
  paymentFlowId: string
  correlationId: string
  rrn: string
}

/**
 * Single source of the bank-transfer log identifiers — no call site assembles them by hand.
 * `rrn` is the provider's payment id; `correlationId` is our own per-attempt key.
 */
export const bankTransferLogContext = (
  paymentFlowId: string,
  correlationId: string,
  rrn: string,
): BankTransferLogContext => ({ paymentFlowId, correlationId, rrn })

/**
 * Row-driven convenience wrapper around `bankTransferLogContext`. Takes the correlationId from
 * `id` rather than `sourceReferenceId`: `create` sets both to the same uuid, and `id` is what every
 * other call site in the module already passes as the correlationId.
 */
export const rowLogContext = (
  row: Pick<BankTransferPayment, 'paymentFlowId' | 'id' | 'providerPaymentId'>,
): BankTransferLogContext =>
  bankTransferLogContext(row.paymentFlowId, row.id, row.providerPaymentId)

/**
 * String rendering of {@link BankTransferLogContext}, for the one sink that accepts no structured
 * metadata: the shared `retry` helper, whose Logger interface is `(message: string) => void`.
 */
export const formatBankTransferLogContext = (
  ctx: BankTransferLogContext,
): string =>
  `[${ctx.paymentFlowId}][correlationId: ${ctx.correlationId}][rrn: ${ctx.rrn}]`

/** True for any status that won't change again (SUCCESS and the three failure values). */
export const isTerminalBankTransferStatus = (
  status: BankTransferStatus,
): boolean => status !== BankTransferStatus.PENDING

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

export const deriveBankTransferFailureReason = (
  status: BankTransferStatus,
  row: Pick<BankTransferPayment, 'expiresAt'>,
): BankTransferFailureReason | null =>
  // Blikk reports a lapsed TTL as a plain ERROR — expiry is derived from the row.
  status === BankTransferStatus.ERROR && isRowExpired(row)
    ? BankTransferFailureReason.EXPIRED
    : toBankTransferFailureReason(status)

/** Builds a PAID FJS charge payload for a settled bank transfer; carries the provider id in `RRN`. */
export const generateBankTransferChargeFJSPayload = ({
  paymentFlow,
  charges,
  totalPrice,
  systemId,
  providerPaymentId,
  correlationId,
  effectiveDate,
}: {
  paymentFlow: PaymentFlowAttributes
  charges: CatalogItemWithQuantity[]
  totalPrice: number
  systemId: string
  providerPaymentId: string
  correlationId: string
  effectiveDate?: Date
}): Charge =>
  generateChargeFJSPayload({
    paymentFlow,
    charges,
    systemId,
    effectiveDate,
    payInfo: {
      RRN: providerPaymentId,
      payableAmount: totalPrice,
      paymentMeans: PayInfoPaymentMeansEnum.Milli,
      correlationId,
    },
  })
