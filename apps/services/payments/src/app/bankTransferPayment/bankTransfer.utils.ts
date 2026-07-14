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

/** Map a raw Blikk status onto the pending sub-status. */
export const mapRawStatusToBankTransferPendingStatus = (
  status: string,
  scaRedirectUrl: string | undefined,
  onboardingOrigin: string,
): BankTransferPendingStatus => {
  if (status === 'SCA_REQUIRED') {
    return BankTransferPendingStatus.SCA_REQUIRED
  }

  // If the payment is a DRAFT and has a non-onboarding SCA URL, return SCA_REQUIRED.
  if (
    status === 'DRAFT' &&
    scaRedirectUrl &&
    !isOnboardingRequired(status, scaRedirectUrl, onboardingOrigin)
  ) {
    return BankTransferPendingStatus.SCA_REQUIRED
  }

  return BankTransferPendingStatus.PROCESSING
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
