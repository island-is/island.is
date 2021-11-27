import { FetchAPI, Request, Headers } from './types'

export interface AuthMiddlewareOptions {
  fetch: FetchAPI
}

export const withAuth = ({ fetch }: AuthMiddlewareOptions): FetchAPI => {
  return (input, init) => {
    const auth = init?.auth ?? (input as Request).auth
    const headers = new Headers(init?.headers)
    if (auth && !headers.has('authorization')) {
      headers.set('authorization', auth.authorization)
    }
    return fetch(input, { ...init, headers })
  }
}
