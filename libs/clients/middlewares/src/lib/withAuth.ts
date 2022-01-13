import { FetchAPI, Request, Headers } from './nodeFetch'

export interface AuthMiddlewareOptions {
  fetch: FetchAPI
  forwardAuthUserAgent: boolean
}

export const withAuth = ({
  fetch,
  forwardAuthUserAgent,
}: AuthMiddlewareOptions): FetchAPI => {
  return (input, init) => {
    const auth = init?.auth ?? (input as Request).auth
    if (!auth) {
      return fetch(input, init)
    }

    const headers = new Headers(init?.headers)
    headers.set('authorization', auth.authorization)
    if (forwardAuthUserAgent && auth.userAgent) {
      headers.set('user-agent', auth.userAgent)
    }
    if (forwardAuthUserAgent && auth.ip) {
      headers.set('x-forwarded-for', auth.ip)
    }
    return fetch(input, { ...init, headers })
  }
}
