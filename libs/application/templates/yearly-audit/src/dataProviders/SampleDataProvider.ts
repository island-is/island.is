import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

interface SampleProviderData {
  value: string
}

export class SampleDataProvider extends BasicDataProvider {
  type = 'SampleDataProvider'

  async provide(application: Application): Promise<unknown> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const data: SampleProviderData = {
      value: 'Hello world',
    }

    return Promise.resolve(data)
  }

  onProvideSuccess(data: SampleProviderData): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data,
      status: 'success',
    }
  }
}
