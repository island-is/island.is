import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messages'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    return (await this.getCatalogForOrganization()) || []
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.feeProviderError,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
