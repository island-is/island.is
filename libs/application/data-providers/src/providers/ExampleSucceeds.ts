import { BasicDataProvider } from '@island.is/application/core'

export class ExampleSucceeds extends BasicDataProvider {
  readonly type = 'ExampleSucceeds'

  provide(): Promise<string> {
    return Promise.resolve('success')
  }
}
