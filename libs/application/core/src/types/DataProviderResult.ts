import { StaticText } from './Form'

export interface DataProviderResult {
  data?: object | string | boolean | number
  date: Date
  reason?: ProviderErrorReason
  status: 'failure' | 'success'
  statusCode?: number
}

export interface FailedDataProviderResult extends DataProviderResult {
  reason?: ProviderErrorReason
  status: 'failure'
}

export interface SuccessfulDataProviderResult extends DataProviderResult {
  status: 'success'
}

export interface ProviderErrorReason {
  title?: StaticText
  summary?: StaticText
}
