import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { error } from '../lib/messages'

const FISKISTOFA_NATIONAL_ID = '6608922069'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items = [
      {
        performingOrgID: '',
        chargeType: '',
        chargeItemCode: '',
        chargeItemName: '',
        priceAmount: 0,
      },
    ]
    // (await this.getCatalogForOrganization(FISKISTOFA_NATIONAL_ID)) || []

    return items
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: error.feeProviderError,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
