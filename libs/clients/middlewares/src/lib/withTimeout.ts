import { MiddlewareAPI, FetchMiddlewareOptions } from './nodeFetch'

export interface TimeoutOptions extends FetchMiddlewareOptions {
  timeout: number
}

export function withTimeout({ timeout, fetch }: TimeoutOptions): MiddlewareAPI {
  return (request) => {
    request.timeout ||= timeout
    return fetch(request)
  }
}
