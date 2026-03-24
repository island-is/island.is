import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { customerRecordsnationalIdGet1 } from '../../gen/fetch'
import type {
  CustomerRecordsnationalIdGet1Data,
  CustomerRercordsOutputDt,
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
}
