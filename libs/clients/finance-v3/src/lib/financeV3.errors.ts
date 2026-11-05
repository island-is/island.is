import type { ProblemDetailsDt } from '../../gen/fetch'

/**
 * The error codes FJS sends in the ProblemDetails `type` of a 400 from `validatePayment` and
 * `payDebt`. The spec does not list them, they come from FJS.
 */
export enum FinanceClientV3PaymentErrorCode {
  /** Kennitala finnst ekki */
  NationalIdNotFound = '2',
  /** Reikningur (payid) finnst ekki */
  PayIdNotFound = '3',
  /** Reikningur (payid) tilheyrir ekki kennitölu */
  PayIdNotOwnedByNationalId = '4',
  /** Samtals greiðsla stemmir ekki við fjárhæð skulda */
  TotalDoesNotMatchDebts = '5',
  /** Búið að taka á móti álagningu, or it is being processed: the payFlowId is taken */
  PayFlowAlreadyReceived = '6',
  /** Gildisdagur ekki á formati YYYY-MM-DD */
  InvalidPaymentDate = '10',
  /** Ekki hægt að taka á móti greiðslu á meðan önnur greiðsla er í vinnslu */
  OtherPaymentInProgress = '12',
  /** Vantar greiðsluupplýsingar */
  PayInfoMissing = '14',
  /** Samtals greiðsla stemmir ekki við fjárhæð í greiðsluupplýsingum */
  PayInfoAmountMismatch = '15',
}

export interface FinanceClientV3Problem {
  /** HTTP status of FJS's answer */
  status: number
  problem?: ProblemDetailsDt
  /** The FJS error code from the problem's `type`, see FinanceClientV3PaymentErrorCode */
  code?: string
}

/**
 * FJS's answer to a call that failed with a non-2xx response, or null when there was no answer
 * (timeouts, network errors, an open circuit breaker).
 *
 * The client throws `FetchError` for non-2xx responses. Duck typed so it also holds when the
 * class comes from another copy of the middlewares lib.
 */
export const getFinanceClientV3Problem = (
  error: unknown,
): FinanceClientV3Problem | null => {
  const e = error as {
    name?: string
    status?: unknown
    body?: unknown
  }

  if (e?.name !== 'FetchError' || typeof e.status !== 'number') {
    return null
  }

  // The spec wraps ProblemDetails in `error`, FJS also answers with it at the top level
  const body = e.body as { error?: ProblemDetailsDt } | null | undefined
  const problem =
    body && typeof body === 'object'
      ? body.error ?? (body as ProblemDetailsDt)
      : undefined

  return {
    status: e.status,
    problem,
    code: problem?.type?.trim() || undefined,
  }
}
