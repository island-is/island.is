import {
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(application: Application): Promise<string[]> {
    const items = this.getCatalogForOrganization('6509142520')

    console.log(items)

    return []
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
