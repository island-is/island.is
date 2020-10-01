import { DataProvider, DataProviderTypes } from '@island.is/application/core'

export class ExampleSucceeds extends DataProvider {
  readonly type = DataProviderTypes.ExampleSucceeds

  provide(): Promise<string> {
    return Promise.resolve('success')
  }
}
