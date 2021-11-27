import { FetchAPI, FetchMiddlewareOptions } from './types'

export interface TimeoutOptions extends FetchMiddlewareOptions {
  timeout: number
}

export function withTimeout({ timeout, fetch }: TimeoutOptions): FetchAPI {
  return (input, init) => fetch(input, { timeout, ...init })
}
