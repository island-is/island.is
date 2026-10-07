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
  CustomerDebtsnationalIdGet2Data,
  CustomerDebtsOutput,
  CustomerRecordsnationalIdGet1Data,
  CustomerRercordsOutputDt,
  PaymentsInDt,
  PaymentsOutDt,
  PayDebtPostResponse,
  ValidatePaymentsInDt,
  ValidatePaymentsOutDt,
} from '../../gen/fetch'

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
    input: CustomerDebtsnationalIdGet2Data['path'] &
      CustomerDebtsnationalIdGet2Data['query'],
  ): Promise<CustomerDebtsOutput | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        customerDebtsnationalIdGet2({
          path: { nationalID: input.nationalID },
          query: {
            nextKey: input.nextKey,
          },
        }),
      ),
    )

    return response?.customerDebtsResult ?? null
  }

  async validatePayment(
    user: User,
    input: ValidatePaymentsInDt,
  ): Promise<ValidatePaymentsOutDt | null> {
    const response = await withAuthContext(user, () =>
      data(validatePaymentPost4({ body: input })),
    )

    return response?.validatePaymentResult ?? null
  }

  async payDebt(
    user: User,
    input: PaymentsInDt,
  ): Promise<PaymentsOutDt | null> {
    const response = (await withAuthContext(user, () =>
      data(payDebtPost3({ body: input })),
    )) as PayDebtPostResponse | undefined

    return response?.payDebtsResult ?? null
  }
}
