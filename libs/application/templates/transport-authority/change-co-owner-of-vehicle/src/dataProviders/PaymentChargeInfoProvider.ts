import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messagesx'
import { ChargeItemCode } from '@island.is/shared/constants'

const CHARGE_ITEM_CODES = [
  ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_ADD.toString(),
  ChargeItemCode.TRANSPORT_AUTHORITY_CHANGE_CO_OWNER_OF_VEHICLE_REMOVE.toString(),
]
const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

export class PaymentChargeInfoProvider extends PaymentCatalogProvider {
  type = 'PaymentChargeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SAMGONGUSTOFA_NATIONAL_ID)) || []
    return items.filter(({ chargeItemCode }) =>
      CHARGE_ITEM_CODES.includes(chargeItemCode),
    )
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
