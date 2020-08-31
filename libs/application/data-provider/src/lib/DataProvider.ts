export enum DataProviderTypes {
  EXPECTED_DATE_OF_BIRTH = 'EXPECTED_DATE_OF_BIRTH',
  EXAMPLE_FAILS = 'EXAMPLE_FAILS',
  EXAMPLE_SUCCEEDS = 'EXAMPLE_SUCCEEDS',
}

export type SuccessfulDataProviderResult = {
  date: Date
  data: object | string | boolean | number
  status: 'success'
  statusCode?: number
}

export type FailedDataProviderResult = {
  data?: object | string | boolean | number
  date: Date
  reason: string
  status: 'failure'
  statusCode?: number
}

export type DataProviderResult =
  | SuccessfulDataProviderResult
  | FailedDataProviderResult

export type ProviderParams = {
  params?: object
  applicant?: string
  applicationId?: string
}

export abstract class DataProvider {
  readonly type: DataProviderTypes

  abstract provide(options: ProviderParams): Promise<unknown>

  // extend this method to transform a rejected response from the provide function to the proper type
  onProvideError(_: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: 'error',
      status: 'failure',
    }
  }
  // extend this method to transform a successful response from the provide function to the proper type
  onProvideSuccess(_: unknown): SuccessfulDataProviderResult {
    return {
      data: true,
      date: new Date(),
      status: 'success',
    }
  }
}
