import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'

const CHARGE_ITEM_CODES = [
  'AY110', 'AY114'
]

const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []

    return items.filter(
      ({ chargeItemCode }) => CHARGE_ITEM_CODES.includes(chargeItemCode),
    )
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
