import { BasicDataProvider } from '@island.is/application/types'

export class ExampleSucceeds extends BasicDataProvider {
  readonly type = 'ExampleSucceeds'

  provide(): Promise<string> {
    return Promise.resolve('success')
  }
}
