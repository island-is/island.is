import { useEffect, useRef, useState } from 'react'

import { CardErrorCode } from '@island.is/shared/constants'

import { useVerifyBankTransferMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

/**
 * Drives the bank-transfer settlement loop. Verifies immediately on enable, then polls with the
 * backoff `1s → 2s → 4s → 8s → 15s` (capped at 15 s thereafter). Hard timeout at 5 min. The verify
 * mutation itself is what triggers settlement on the backend (see `BankTransferService.verify` →
 * `confirmBankTransferPayment`), so polling is also doing the settling — Blikk's webhook to the FE
 * Next.js handler is a fast-path optimization, not a requirement.
 *
 * Terminal results call `onSuccess` / `onFailure` once and stop the loop. `BankTransferNotFound`
 * (no active attempt) also stops the loop silently — the caller should bump `trigger` after starting
 * a new attempt to restart polling (covers the back-channel SCA case, where the user stays on the
 * page after submit and a row only exists once `paymentsCreateBankTransfer` returns).
 */
interface UseBankTransferStatusPollingProps {
  paymentFlowId: string | undefined
  /** Gate the loop. Typically `paymentStatus === 'unpaid'`. */
  enabled: boolean
  /** Bump to restart polling (e.g. after a no-redirect submit). */
  trigger?: unknown
  onSuccess: () => void
  onFailure: (error: PaymentError) => void
}

const HARD_TIMEOUT_MS = 5 * 60 * 1000
const POLL_INTERVALS_MS = [1000, 2000, 4000, 8000, 15000]
const NOT_FOUND_MARKER = 'BankTransferNotFound'

const nextInterval = (attempt: number) =>
  POLL_INTERVALS_MS[Math.min(attempt, POLL_INTERVALS_MS.length - 1)]

export const useBankTransferStatusPolling = ({
  paymentFlowId,
  enabled,
  trigger,
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

    setIsPolling(true)

    const stop = () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      setIsPolling(false)
    }

    const poll = async () => {
      if (cancelled) return

      if (Date.now() - startedAt > HARD_TIMEOUT_MS) {
        stop()
        onFailureRef.current({ code: CardErrorCode.UnknownCardError })
        return
      }

      try {
        const result = await verifyBankTransferMutation({
          variables: { input: { paymentFlowId } },
        })
        if (cancelled) return

        const status = result.data?.paymentsVerifyBankTransfer.status
        if (status === 'success') {
          stop()
          onSuccessRef.current()
          return
        }
        if (
          status === 'error' ||
          status === 'rejected' ||
          status === 'cancelled'
        ) {
          stop()
          onFailureRef.current({ code: CardErrorCode.GenericDecline })
          return
        }
        // PENDING — schedule the next poll.
        timeoutId = setTimeout(poll, nextInterval(attempt))
        attempt++
      } catch (e) {
        if (cancelled) return
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
      if (timeoutId) clearTimeout(timeoutId)
    }
    // `trigger` is in deps so callers can restart polling explicitly.
  }, [paymentFlowId, enabled, trigger, verifyBankTransferMutation])

  return { isPolling }
}
