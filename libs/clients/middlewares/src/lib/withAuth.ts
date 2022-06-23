import { MiddlewareAPI } from './nodeFetch'

export interface AuthMiddlewareOptions {
  fetch: MiddlewareAPI
  forwardAuthUserAgent: boolean
}

export const withAuth = ({
  fetch,
  forwardAuthUserAgent,
}: AuthMiddlewareOptions): MiddlewareAPI => {
  return (request) => {
    const auth = request.auth
    if (!auth) {
      return fetch(request)
    }

    request.headers.set('authorization', auth.authorization)
    if (forwardAuthUserAgent && auth.userAgent) {
      request.headers.set('user-agent', auth.userAgent)
    }
    if (forwardAuthUserAgent && auth.ip) {
      request.headers.set('x-forwarded-for', auth.ip)
    }
    return fetch(request)
  }
}
