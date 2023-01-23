import { ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RootState } from '../../redux/store'

// Týpa til að einfalda thunk typing
export type AppThunk<ReturnType = any> = ThunkAction<
  ReturnType,
  RootState,
  {},
  AnyAction
>

export interface FetchActionCreators {
  request(): AnyAction
  success(data: any): AnyAction
  failure(errorMessage?: string): AnyAction
}

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
}

export interface HttpResponse {
  success: boolean
  statusCode: number
  data?: any
  message?: string
}

export enum MimeType {
  json = 'application/json',
}
