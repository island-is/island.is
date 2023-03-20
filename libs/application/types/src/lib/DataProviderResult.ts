import { ProviderErrorReason } from '@island.is/shared/problem'
import { StaticText } from '@island.is/shared/types'

export interface DataProviderResult {
  data?: object | string | boolean | number
  date: Date
  reason?: ProviderErrorReason[] | ProviderErrorReason | StaticText
  status: 'failure' | 'success'
  statusCode?: number
}

export interface FailedDataProviderResult extends DataProviderResult {
  reason?: ProviderErrorReason[] | ProviderErrorReason | StaticText
  status: 'failure'
}

export interface SuccessfulDataProviderResult extends DataProviderResult {
  status: 'success'
}
