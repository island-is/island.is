import {
  DataProvider,
  DataProviderTypes,
  SuccessfulDataProviderResult,
} from '../lib/DataProvider'

export class ExpectedDateOfBirth extends DataProvider {
  readonly type: DataProviderTypes.EXPECTED_DATE_OF_BIRTH

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
