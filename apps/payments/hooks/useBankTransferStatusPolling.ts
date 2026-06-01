import { useEffect, useRef, useState } from 'react'

import { PaymentsBankTransferStatus } from '@island.is/api/schema'
import { CardErrorCode } from '@island.is/shared/constants'

import { useVerifyBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

/**
 * Polls `paymentsVerifyBankTransfer` until the attempt reaches a terminal state.
 */
interface UseBankTransferStatusPollingProps {
  paymentFlowId: string | undefined
  // Gate the loop`.
  enabled: boolean
  // Bump to restart polling
  trigger?: unknown
  // Bank transfer payment `expires_at` (matches the TTL we shared with Blikk). Drives the hard timeout
  expiresAt?: Date | string | null
  onSuccess: () => void
  onFailure: (error: PaymentError) => void
}

const POLL_INTERVALS_MS = [1000, 2000, 4000, 8000, 15000]
const NOT_FOUND_MARKER = 'BankTransferNotFound'
const TIMEOUT_GRACE_MS = 30 * 1000 // 30 seconds
const FALLBACK_HARD_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

const nextInterval = (attempt: number) =>
  POLL_INTERVALS_MS[Math.min(attempt, POLL_INTERVALS_MS.length - 1)]

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
  trigger,
  expiresAt,
  onSuccess,
  onFailure,
}: UseBankTransferStatusPollingProps) => {
  const [verifyBankTransferMutation] = useVerifyBankTransferMutation()
  const [isPolling, setIsPolling] = useState(false)

  // Latest-value refs so callback identity changes don't restart the effect.
  const onSuccessRef = useRef(onSuccess)
  const onFailureRef = useRef(onFailure)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])
  useEffect(() => {
    onFailureRef.current = onFailure
  }, [onFailure])

  useEffect(() => {
    if (!enabled || !paymentFlowId) {
      setIsPolling(false)
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let attempt = 0
    const startedAt = Date.now()
    const hardTimeoutMs = computeHardTimeoutMs(expiresAt)

    setIsPolling(true)

    const stop = () => {
      cancelled = true

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      setIsPolling(false)
    }

    const poll = async () => {
      if (cancelled) {
        return
      }

      // hard timeout reached
      if (Date.now() - startedAt > hardTimeoutMs) {
        stop()
        onFailureRef.current({ code: CardErrorCode.UnknownCardError })
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

        const status = result.data?.paymentsVerifyBankTransfer.status
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
          onFailureRef.current({ code: CardErrorCode.GenericDecline })
          return
        }
        // PENDING — schedule the next poll.
        timeoutId = setTimeout(poll, nextInterval(attempt))
        attempt++
      } catch (e) {
        if (cancelled) {
          return
        }
        const message = e instanceof Error ? e.message : ''
        if (message.includes(NOT_FOUND_MARKER)) {
          // No active attempt — exit silently. A subsequent `trigger` change restarts the loop.
          stop()
          return
        }
        // Transient network/server hiccup — retry with backoff.
        timeoutId = setTimeout(poll, nextInterval(attempt))
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
    // `trigger` is in deps so callers can restart polling explicitly; `expiresAt` is in deps so
    // a post-submit value updates the timeout when it arrives.
  }, [paymentFlowId, enabled, trigger, expiresAt, verifyBankTransferMutation])

  return { isPolling }
}
