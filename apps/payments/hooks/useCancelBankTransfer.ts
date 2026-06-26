import { useCallback } from 'react'

import { useCancelBankTransferMutation } from '../graphql/mutations.graphql.generated'

interface UseCancelBankTransferProps {
  paymentFlowId: string | undefined
}

/**
 * Wraps `paymentsCancelBankTransfer` for the two FE callers:
 *  - "Cancel" on the pending screen — soft-deletes the active row + best-effort tells Blikk.
 *  - "Start Again" on the failed screen — soft-deletes the failed row so SSR flips back to UNPAID.
 *
 * Callers `router.reload()` on success and on `PaymentServiceCode.PaymentFlowAlreadyPaid` (race with
 * a concurrent finalize → server is now PAID, reload to receipt). Other mutation errors are surfaced
 * via `toast.error`. Idempotent on the server side.
 */
export const useCancelBankTransfer = ({
  paymentFlowId,
}: UseCancelBankTransferProps) => {
  const [cancelMutation, { loading: isCancelling }] =
    useCancelBankTransferMutation()

  const cancelBankTransfer = useCallback(async () => {
    if (!paymentFlowId) return
    await cancelMutation({ variables: { input: { paymentFlowId } } })
  }, [paymentFlowId, cancelMutation])

  return { cancelBankTransfer, isCancelling }
}
