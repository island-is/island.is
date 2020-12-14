import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class DirectorateOfLabor extends BasicDataProvider {
  type = 'DirectorateOfLabor'

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
