import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messages'

//TODO: change to correct code once its available on DEV
const CHARGE_ITEM_CODES = ['AY110']

// eslint-disable-next-line local-rules/disallow-kennitalas
const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []
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

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
