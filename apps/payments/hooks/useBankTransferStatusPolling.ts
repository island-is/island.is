import type { ApolloError } from '@apollo/client'
import { useEffect, useRef } from 'react'

import {
  PaymentsBankTransferFailureReason,
  PaymentsBankTransferStatus,
  PaymentsBankTransferPendingStatus,
} from '@island.is/api/schema'
import { BankTransferErrorCode } from '@island.is/shared/constants'
import { findProblemInApolloError } from '@island.is/shared/problem'

import { useVerifyBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

export interface BankTransferStatusUpdate {
  pendingStatus?: PaymentsBankTransferPendingStatus | null
  scaRedirectUrl?: string | null
}

/**
 * Polls `paymentsVerifyBankTransfer` until the attempt reaches a terminal state.
 */
interface UseBankTransferStatusPollingProps {
  paymentFlowId: string | undefined
  // Gate the loop.
  enabled: boolean
  // Bank transfer payment `expires_at` (matches the TTL we shared with Blikk). Drives the hard timeout
  expiresAt?: Date | string | null
  onSuccess: () => void
  onFailure: (error: PaymentError) => void
  // Non-terminal sub-status updates..
  onStatusUpdate?: (update: BankTransferStatusUpdate) => void
}

const POLL_INTERVALS_MS = [500, 1000, 2000, 3000, 5000]
// Slower steady state once the SCA URL is on screen.
const SCA_WAIT_POLL_MS = 10 * 1000
const TIMEOUT_GRACE_MS = 30 * 1000 // 30 seconds
// Matches the prod Blikk TTL (600s). Used only when `expiresAt` is missing.
const FALLBACK_HARD_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes

const nextInterval = (attempt: number, isAwaitingSca: boolean) =>
  isAwaitingSca
    ? SCA_WAIT_POLL_MS
    : POLL_INTERVALS_MS[Math.min(attempt, POLL_INTERVALS_MS.length - 1)]

const terminalStatusToErrorCode = (
  status: PaymentsBankTransferStatus,
): BankTransferErrorCode => {
  switch (status) {
    case PaymentsBankTransferStatus.rejected:
      return BankTransferErrorCode.BankTransferRejected
    case PaymentsBankTransferStatus.cancelled:
      return BankTransferErrorCode.BankTransferCancelled
    default:
      return BankTransferErrorCode.BankTransferGenericError
  }
}

const terminalFailureToErrorCode = (
  status: PaymentsBankTransferStatus,
  failureReason?: PaymentsBankTransferFailureReason | null,
): BankTransferErrorCode => {
  switch (failureReason) {
    case PaymentsBankTransferFailureReason.expired:
      return BankTransferErrorCode.BankTransferExpired
    case PaymentsBankTransferFailureReason.rejected:
      return BankTransferErrorCode.BankTransferRejected
    case PaymentsBankTransferFailureReason.cancelled:
      return BankTransferErrorCode.BankTransferCancelled
    default:
      return terminalStatusToErrorCode(status)
  }
}

const computeHardTimeoutMs = (
  expiresAt: Date | string | null | undefined,
): number => {
  if (!expiresAt) {
    return FALLBACK_HARD_TIMEOUT_MS
  }

  const expiry = new Date(expiresAt).getTime()
  if (Number.isNaN(expiry)) {
    return FALLBACK_HARD_TIMEOUT_MS
  }

  // Clamp to a minimum positive value so at least one poll runs.
  return Math.max(1000, expiry - Date.now() + TIMEOUT_GRACE_MS)
}

export const useBankTransferStatusPolling = ({
  paymentFlowId,
  enabled,
  expiresAt,
  onSuccess,
  onFailure,
  onStatusUpdate,
}: UseBankTransferStatusPollingProps) => {
  const [verifyBankTransferMutation] = useVerifyBankTransferMutation()

  // Latest-value refs so callback identity changes don't restart the effect.
  const onSuccessRef = useRef(onSuccess)
  const onFailureRef = useRef(onFailure)
  const onStatusUpdateRef = useRef(onStatusUpdate)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])
  useEffect(() => {
    onFailureRef.current = onFailure
  }, [onFailure])
  useEffect(() => {
    onStatusUpdateRef.current = onStatusUpdate
  }, [onStatusUpdate])

  useEffect(() => {
    if (!enabled || !paymentFlowId) {
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let attempt = 0
    let isAwaitingSca = false
    const startedAt = Date.now()
    const hardTimeoutMs = computeHardTimeoutMs(expiresAt)

    const stop = () => {
      cancelled = true

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }

    const poll = async () => {
      if (cancelled) {
        return
      }

      // hard timeout reached
      if (Date.now() - startedAt > hardTimeoutMs) {
        stop()
        onFailureRef.current({
          code: BankTransferErrorCode.BankTransferExpired,
        })
        return
      }

      try {
        const result = await verifyBankTransferMutation({
          variables: { input: { paymentFlowId } },
        })
        // if the request was cancelled, stop polling
        if (cancelled) {
          return
        }

        const verifyResult = result.data?.paymentsVerifyBankTransfer
        const status = verifyResult?.status
        if (status === PaymentsBankTransferStatus.success) {
          stop()
          onSuccessRef.current()
          return
        }
        if (
          status === PaymentsBankTransferStatus.error ||
          status === PaymentsBankTransferStatus.rejected ||
          status === PaymentsBankTransferStatus.cancelled
        ) {
          stop()
          onFailureRef.current({
            code: terminalFailureToErrorCode(
              status,
              verifyResult?.failureReason,
            ),
          })
          return
        }
        // PENDING — surface sub-status changes (e.g. a fresh SCA URL) and schedule the next poll.
        onStatusUpdateRef.current?.({
          pendingStatus: verifyResult?.pendingStatus,
          scaRedirectUrl: verifyResult?.scaRedirectUrl,
        })
        // Decay to the slow interval while the payer acts on the SCA UI; back to fast once the
        // status moves on (processing — settlement typically resolves within seconds).
        isAwaitingSca =
          verifyResult?.pendingStatus ===
            PaymentsBankTransferPendingStatus.sca_required &&
          !!verifyResult?.scaRedirectUrl
        timeoutId = setTimeout(poll, nextInterval(attempt, isAwaitingSca))
        attempt++
      } catch (e) {
        if (cancelled) {
          return
        }
        const problemDetail = findProblemInApolloError(e as ApolloError)?.detail
        if (problemDetail === BankTransferErrorCode.BankTransferNotFound) {
          // No active attempt — exit silently.
          stop()
          return
        }
        // Transient network/server hiccup — retry with backoff.
        timeoutId = setTimeout(poll, nextInterval(attempt, isAwaitingSca))
        attempt++
      }
    }

    poll()

    return () => {
      cancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
    // `expiresAt` is in deps so a value arriving after mount updates the hard timeout.
  }, [paymentFlowId, enabled, expiresAt, verifyBankTransferMutation])
}
