import { Inject, Injectable } from '@nestjs/common'

import {
  FinanceClientV3PaymentErrorCode,
  FinanceClientV3ResultMissingError,
  FinanceClientV3Service,
  getFinanceClientV3Problem,
} from '@island.is/clients/finance-v3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  formatFjsDebtPaymentDate,
  parsePaymentOptions,
} from '../../utils/fjsDebtPayment'
import type {
  FjsDebt,
  FjsDebtPayInput,
  FjsDebtPayOutcome,
  FjsDebtValidateInput,
  FjsDebtValidateOutcome,
} from './fjsDebt.types'

const toRequestBody = ({
  flowId,
  payerNationalId,
  debts,
  paymentDate,
}: FjsDebtValidateInput) => ({
  payFlowId: flowId,
  nationalId: payerNationalId,
  totalAmount: debts.reduce((sum: number, debt: FjsDebt) => {
    return sum + debt.amount
  }, 0),
  paymentDate: formatFjsDebtPaymentDate(paymentDate),
  payDebts: debts.map((debt) => ({
    payid: debt.payId,
    payAmount: debt.amount,
  })),
})

const isAuthError = (status: number) => status === 401 || status === 403

/**
 * Talks to FJS about debts, and sorts every way a call can go into an outcome the callers act
 * on, so that none of them has to read raw client errors.
 */
@Injectable()
export class FjsDebtGateway {
  constructor(
    private readonly financeClient: FinanceClientV3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async validate(input: FjsDebtValidateInput): Promise<FjsDebtValidateOutcome> {
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

      const http = getFinanceClientV3Problem(error)
      if (http?.status === 400) {
        if (
          http.code === FinanceClientV3PaymentErrorCode.PayFlowAlreadyReceived
        ) {
          return { type: 'already_registered', problem: http.problem }
        }
        // Says nothing about these debts, they can be paid once the other payment is through
        if (
          http.code === FinanceClientV3PaymentErrorCode.OtherPaymentInProgress
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

  async pay(input: FjsDebtPayInput): Promise<FjsDebtPayOutcome> {
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
      const http = getFinanceClientV3Problem(error)

      if (http?.status === 400) {
        if (
          http.code === FinanceClientV3PaymentErrorCode.PayFlowAlreadyReceived
        ) {
          return { type: 'already_registered', problem: http.problem }
        }
        // FJS turned the call away without taking it, a later retry can go through
        if (
          http.code === FinanceClientV3PaymentErrorCode.OtherPaymentInProgress
        ) {
          return { type: 'busy', problem: http.problem }
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
