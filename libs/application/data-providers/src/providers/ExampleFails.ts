import { BasicDataProvider } from '@island.is/application/core'

export class ExampleFails extends BasicDataProvider {
  readonly type = 'ExampleFails'

  provide(): Promise<unknown> {
    return Promise.reject('this should reject')
  }
}
