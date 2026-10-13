import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { data, dataOr404Null } from '@island.is/clients/middlewares'
import {
  customerDebtsnationalIdGet2,
  customerRecordsnationalIdGet1,
  payDebtPost3,
  validatePaymentPost4,
} from '../../gen/fetch'
import type {
  CustomerDebtsOutput,
  CustomerRecordsnationalIdGet1Data,
  CustomerRercordsOutputDt,
  PaymentsInDt,
  PaymentsOutDt,
  ProblemDetailsDt,
  ValidatePaymentsInDt,
  ValidatePaymentsOutDt,
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
   * Validates that the given debts and amounts can be paid. Called without a
   * user context, so it authenticates with client credentials.
   *
   * Non-2xx responses throw a `FetchError` (from `@island.is/clients/middlewares`)
   * whose `body.error` holds the FJS problem details.
   */
  async validatePayment(
    input: ValidatePaymentsInDt,
  ): Promise<ValidatePaymentsOutDt> {
    const response = await data(validatePaymentPost4({ body: input }))

    if (!response?.validatePaymentResult) {
      throw new FinanceClientV3ResultMissingError(
        'validatePayment',
        response?.error,
      )
    }

    return response.validatePaymentResult
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
