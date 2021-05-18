import { StaticText } from './Form'

export interface DataProviderResult {
  data?: object | string | boolean | number
  date: Date
  reason?: StaticText
  status: 'failure' | 'success'
  statusCode?: number
}

export interface FailedDataProviderResult extends DataProviderResult {
  reason: StaticText
  status: 'failure'
}

export interface SuccessfulDataProviderResult extends DataProviderResult {
  status: 'success'
}
