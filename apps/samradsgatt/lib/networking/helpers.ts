// import { logout } from '../../login/actions';
// import { tokenService } from '../tokenService';
import {
  FetchActionCreators,
  AppThunk,
  HttpMethod,
  HttpResponse,
  MimeType,
} from './types'

/*
 * TODO:
 * In this file there are strings in icelandic.
 * Needs to be translated.
 */

// Todo gera config fyrir BASE_URL
export const BASE_URL = 'https://samradapi-test.island.is/'

export const BASE_API = `${BASE_URL}/api/v1`

const DEFAULT_TIMEOUT = 20000
const TIMEOUT_ERR_MSG = `Aðgerð rann út á tíma`

const _fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout = DEFAULT_TIMEOUT,
): Promise<Response> => {
  //@ts-ignore
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(TIMEOUT_ERR_MSG)), timeout),
    ),
  ])
}

export async function call(
  method: HttpMethod,
  url: string,
  payload?: any,
): Promise<HttpResponse> {
  const headers: { [key: string]: string } = { Accept: MimeType.json }
  if (method === HttpMethod.POST) headers['Content-Type'] = MimeType.json

  const options: RequestInit = {
    method,
    headers,
  }

  if (method === HttpMethod.POST) options.body = JSON.stringify(payload)
  const res = await _fetchWithTimeout(url, options)
  const httpResponse: HttpResponse = {
    success: res.ok,
    statusCode: res.status,
  }

  if (res.headers.get('Content-Type')?.includes(MimeType.json)) {
    let content = null
    const jsonError = 'Gölluð gögn frá vefþjónustu'

    try {
      content = await res.json()
    } catch (error) {
      content = jsonError
    }

    if (!res.ok || content === jsonError) {
      httpResponse.message = content
    } else {
      httpResponse.data = content
    }
  }

  return httpResponse
}

export function post(
  path: string,
  actionCreators: FetchActionCreators,
  payload: any,
  onSuccess?: (response: HttpResponse) => any,
  onError?: (response: HttpResponse) => Promise<string> | string,
): AppThunk {
  return async (dispatch, getState) => {
    dispatch(actionCreators.request())
    let result = null
    try {
      result = await call(HttpMethod.POST, `${BASE_API}/${path}`, payload)

      // if (result.statusCode === 401 && getState().login.loggedIn) {
      //   return
      // }

      if (!result.success) {
        let errMsg = ''
        if (onError) errMsg = await onError(result)
        throw Error(errMsg)
      }

      let { data } = result
      if (onSuccess) data = await onSuccess(result)
      dispatch(actionCreators.success(data))
    } catch (error: any) {
      dispatch(actionCreators.failure(error.message))
    } finally {
      return result
    }
  }
}

export function get(
  path: string,
  actionCreators: FetchActionCreators,
  onSuccess?: (response: HttpResponse) => any,
  onError?: (response: HttpResponse) => Promise<string> | string,
): AppThunk {
  return async (dispatch, getState) => {
    dispatch(actionCreators.request())
    let result = null
    try {
      result = await call(HttpMethod.GET, `${BASE_API}/${path}`)

      // if (result.statusCode === 401 && getState().login.loggedIn) {
      //   return
      // }

      if (!result.success) {
        let errMsg = ''
        if (onError) errMsg = await onError(result)
        throw Error(errMsg)
      }

      let { data } = result
      if (onSuccess) data = await onSuccess(result)

      dispatch(actionCreators.success(data))
      return data
    } catch (error: any) {
      dispatch(actionCreators.failure(error.message))
    } finally {
      return result
    }
  }
}
