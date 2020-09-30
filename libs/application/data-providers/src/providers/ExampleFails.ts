import { DataProvider, DataProviderTypes } from '@island.is/application/core'

export class ExampleFails extends DataProvider {
  readonly type = DataProviderTypes.ExampleFails

  provide(): Promise<unknown> {
    return Promise.reject('this should reject')
  }
}
