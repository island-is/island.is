import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class ExpectedDateOfBirth extends BasicDataProvider {
  readonly type = 'ExpectedDateOfBirth'

  onProvideSuccess(_: unknown): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: '2021-01-15',
      status: 'success',
    }
  }

  provide(): Promise<unknown> {
    return Promise.resolve()
  }
}
