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
