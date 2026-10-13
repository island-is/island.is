import { Inject, Injectable } from '@nestjs/common'

import {
  FinanceClientV3ResultMissingError,
  FinanceClientV3Service,
} from '@island.is/clients/finance-v3'
import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  formatFjsDebtPaymentDate,
  parsePaymentOptions,
} from '../../utils/fjsDebtPayment'
import type {
  DebtFjsDebt,
  DebtFjsPayInput,
  DebtFjsPayOutcome,
  DebtFjsValidateInput,
  DebtFjsValidateOutcome,
} from './debtFjs.types'

const toRequestBody = ({
  flowId,
  payerNationalId,
  debts,
  paymentDate,
}: DebtFjsValidateInput) => ({
  payFlowId: flowId,
  nationalId: payerNationalId,
  totalAmount: debts.reduce((sum: number, debt: DebtFjsDebt) => {
    return sum + debt.amount
  }, 0),
  paymentDate: formatFjsDebtPaymentDate(paymentDate),
  payDebts: debts.map((debt) => ({
    payid: debt.payId,
    payAmount: debt.amount,
  })),
})

/**
 * The client throws `FetchError` for non-2xx responses. Duck typed so it also holds when the
 * class comes from another copy of the middlewares lib.
 */
const getHttpErrorDetails = (
  error: unknown,
): { status: number; problem?: ProblemDetailsDt } | null => {
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

  return { status: e.status, problem }
}

const isAuthError = (status: number) => status === 401 || status === 403

/**
 * The error codes FJS sends in the ProblemDetails `type` of a 400, from both `validatePayment`
 * and `payDebt`. `PayFlowAlreadyReceived` and `OtherPaymentInProgress` are handled on their own,
 * every other code is a rejection.
 */
const FjsDebtErrorCode = {
  /** Kennitala finnst ekki */
  NationalIdNotFound: '2',
  /** Reikningur (payid) finnst ekki */
  PayIdNotFound: '3',
  /** Reikningur (payid) tilheyrir ekki kennitölu */
  PayIdNotOwnedByNationalId: '4',
  /** Samtals greiðsla stemmir ekki við fjárhæð skulda */
  TotalDoesNotMatchDebts: '5',
  /** Búið að taka á móti álagningu, or it is being processed: the payFlowId is taken */
  PayFlowAlreadyReceived: '6',
  /** Gildisdagur ekki á formati YYYY-MM-DD */
  InvalidPaymentDate: '10',
  /** Ekki hægt að taka á móti greiðslu á meðan önnur greiðsla er í vinnslu */
  OtherPaymentInProgress: '12',
  /** Vantar greiðsluupplýsingar */
  PayInfoMissing: '14',
  /** Samtals greiðsla stemmir ekki við fjárhæð í greiðsluupplýsingum */
  PayInfoAmountMismatch: '15',
} as const

const hasErrorCode = (problem: ProblemDetailsDt | undefined, code: string) =>
  problem?.type?.trim() === code

/**
 * Talks to FJS about debts, and sorts every way a call can go into an outcome the callers act
 * on, so that none of them has to read raw client errors.
 */
@Injectable()
export class DebtFjsService {
  constructor(
    private readonly financeClient: FinanceClientV3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async validate(input: DebtFjsValidateInput): Promise<DebtFjsValidateOutcome> {
    try {
      const result = await this.financeClient.validatePayment(
        toRequestBody(input),
      )

      const paymentOptions = parsePaymentOptions(
        result.paymentOptions,
        (token) =>
          this.logger.warn(
            `[${input.flowId}] Unknown FJS debt payment option ignored`,
            { token },
          ),
      )

      return {
        type: 'valid',
        paymentOptions,
        rawPaymentOptions: result.paymentOptions,
      }
    } catch (error) {
      if (error instanceof FinanceClientV3ResultMissingError) {
        return { type: 'transient', error }
      }

      const http = getHttpErrorDetails(error)
      if (http?.status === 400) {
        if (
          hasErrorCode(http.problem, FjsDebtErrorCode.PayFlowAlreadyReceived)
        ) {
          return { type: 'already_registered', problem: http.problem }
        }
        // Says nothing about these debts, they can be paid once the other payment is through
        if (
          hasErrorCode(http.problem, FjsDebtErrorCode.OtherPaymentInProgress)
        ) {
          return { type: 'transient', error }
        }
        return { type: 'invalid', problem: http.problem }
      }

      // Everything else, 401/403, 5xx, timeouts, network errors and an open circuit breaker,
      // says nothing about the debts.
      return { type: 'transient', error }
    }
  }

  async pay(input: DebtFjsPayInput): Promise<DebtFjsPayOutcome> {
    try {
      const body = { ...toRequestBody(input), payInfo: input.payInfo }
      const result = input.timeoutMs
        ? await this.financeClient.payDebt(body, { timeoutMs: input.timeoutMs })
        : await this.financeClient.payDebt(body)

      // FJS knows the payment by the flow id, it should echo it back unchanged
      if (result.payFlowId !== input.flowId) {
        this.logger.warn(
          `[${input.flowId}] FJS registered the debt payment under another payFlowId`,
          { payFlowId: result.payFlowId },
        )
      }

      return { type: 'registered', dateCreated: result.dateCreated }
    } catch (error) {
      const http = getHttpErrorDetails(error)

      if (http?.status === 400) {
        if (
          hasErrorCode(http.problem, FjsDebtErrorCode.PayFlowAlreadyReceived)
        ) {
          return { type: 'already_registered', problem: http.problem }
        }
        // FJS turned the call away without taking it, a later retry can go through
        if (
          hasErrorCode(http.problem, FjsDebtErrorCode.OtherPaymentInProgress)
        ) {
          return { type: 'transient', error }
        }
        return { type: 'rejected', problem: http.problem }
      }

      // FJS did not process the call, no need to treat a later retry with care.
      if (http && isAuthError(http.status)) {
        return { type: 'transient', error }
      }

      // 5xx, timeouts, network errors, an open circuit breaker (opossum EOPENBREAKER) and a 2xx
      // without a result: FJS may have processed the call.
      return { type: 'ambiguous', error }
    }
  }
}
