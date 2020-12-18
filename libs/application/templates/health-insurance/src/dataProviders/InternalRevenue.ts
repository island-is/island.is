import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class InternalRevenue extends BasicDataProvider {
  type = 'InternalRevenue'

  provide(application: Application): Promise<string> {
    return Promise.resolve('success')
  }
  onProvideSuccess(): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: {},
      status: 'success',
    }
  }
}
