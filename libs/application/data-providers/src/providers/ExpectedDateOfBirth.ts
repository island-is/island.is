import {
  DataProvider,
  DataProviderTypes,
  SuccessfulDataProviderResult,
} from '@island.is/application/schema'

export class ExpectedDateOfBirth extends DataProvider {
  readonly type: DataProviderTypes.ExpectedDateOfBirth

  onProvideSuccess(_: unknown): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: '2020-12-24',
      status: 'success',
    }
  }

  provide(): Promise<unknown> {
    return Promise.resolve()
  }
}
