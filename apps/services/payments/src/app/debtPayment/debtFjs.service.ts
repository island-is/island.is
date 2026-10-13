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
    body?: { error?: ProblemDetailsDt }
  }

  if (e?.name !== 'FetchError' || typeof e.status !== 'number') {
    return null
  }

  return { status: e.status, problem: e.body?.error }
}

const isAuthError = (status: number) => status === 401 || status === 403

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

      return {
        type: 'registered',
        payFlowId: result.payFlowId,
        dateCreated: result.dateCreated,
      }
    } catch (error) {
      const http = getHttpErrorDetails(error)

      if (http?.status === 400) {
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
