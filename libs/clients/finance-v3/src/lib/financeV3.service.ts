import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { data, dataOr404Null } from '@island.is/clients/middlewares'
import {
  customerDebtsnationalIdGet2,
  customerRecordsnationalIdGet1,
  payDebtPost3,
  payrollDeductionGet5,
  validatePaymentPost4,
  type CustomerDebtsOutput,
  type CustomerRecordsnationalIdGet1Data,
  type CustomerRercordsOutputDt,
  type PayerOfWagesOutput,
  type PaymentsInDt,
  type PaymentsOutDt,
  type ProblemDetailsDt,
  type ValidatePaymentsInDt,
} from '../../gen/fetch'

/**
 * Thrown when FJS answers with a success status but without the expected
 * result, e.g. a 2xx body that only carries `error`.
 */
export class FinanceClientV3ResultMissingError extends Error {
  constructor(operation: string, public problem?: ProblemDetailsDt) {
    super(`FJS ${operation} returned no result`)
    this.name = 'FinanceClientV3ResultMissingError'
  }
}

/** `validatePayment`'s answer, with FJS's payment options split into a list. */
export interface FinanceClientV3PaymentValidation {
  /** The payment methods FJS allows, as FJS names them, e.g. `['CARD', 'TRANSFER']`. */
  paymentOptions: string[]
}

/** FJS sends the options as one string, e.g. "CARD;TRANSFER". Commas are accepted too. */
const splitPaymentOptions = (paymentOptions?: string | null): string[] =>
  (paymentOptions ?? '')
    .split(/[;,]/)
    .map((option) => option.trim())
    .filter(Boolean)

@Injectable()
export class FinanceClientV3Service {
  async getCustomerRecords(
    user: User,
    input: CustomerRecordsnationalIdGet1Data['path'] &
      CustomerRecordsnationalIdGet1Data['query'],
  ): Promise<CustomerRercordsOutputDt | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        customerRecordsnationalIdGet1({
          path: { nationalID: input.nationalID },
          query: {
            dayFrom: input.dayFrom,
            dayTo: input.dayTo,
            chargeTypeID: input.chargeTypeID,
            nextKey: input.nextKey,
          },
        }),
      ),
    )

    return response?.resultCustomerRecords ?? null
  }

  async getCustomerDebts(
    user: User,
    input: { nationalID: string; nextKey?: string },
  ): Promise<CustomerDebtsOutput | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        customerDebtsnationalIdGet2({
          path: { nationalID: input.nationalID },
          query: { nextKey: input.nextKey },
        }),
      ),
    )

    return response?.customerDebtsResult ?? null
  }

  /**
   * The user's employer and the charge types FJS may collect through payroll
   * deduction. `null` when FJS has no employer on record.
   */
  async getPayrollDeduction(
    user: User,
    input: { nationalID: string },
  ): Promise<PayerOfWagesOutput | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        payrollDeductionGet5({ query: { nationalID: input.nationalID } }),
      ),
    )

    return response?.payrollDeductionResult ?? null
  }

  /**
   * Validates that the given debts and amounts can be paid. Called without a
   * user context, so it authenticates with client credentials.
   *
   * Non-2xx responses throw a `FetchError` (from `@island.is/clients/middlewares`)
   * whose `body.error` holds the FJS problem details.
   */
  async validatePayment(
    input: ValidatePaymentsInDt,
  ): Promise<FinanceClientV3PaymentValidation> {
    const response = await data(validatePaymentPost4({ body: input }))

    if (!response?.validatePaymentResult) {
      throw new FinanceClientV3ResultMissingError(
        'validatePayment',
        response?.error,
      )
    }

    return {
      paymentOptions: splitPaymentOptions(
        response.validatePaymentResult.paymentOptions,
      ),
    }
  }

  /**
   * Registers a payment against debts. FJS answers 202 Accepted on success.
   * Called without a user context, so it authenticates with client credentials.
   *
   * Non-2xx responses throw a `FetchError` (from `@island.is/clients/middlewares`)
   * whose `body.error` holds the FJS problem details.
   *
   * `timeoutMs` ends the call earlier than the client wide timeout, an aborted call throws like
   * any other network failure.
   */
  async payDebt(
    input: PaymentsInDt,
    options?: { timeoutMs?: number },
  ): Promise<PaymentsOutDt> {
    const response = await data(
      payDebtPost3({
        body: input,
        signal: options?.timeoutMs
          ? AbortSignal.timeout(options.timeoutMs)
          : undefined,
      }),
    )

    if (!response?.payDebtsResult) {
      throw new FinanceClientV3ResultMissingError('payDebt', response?.error)
    }

    return response.payDebtsResult
  }
}
