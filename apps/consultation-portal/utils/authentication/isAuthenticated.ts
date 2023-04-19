import cookies from 'next-cookies'
import environment from '../../lib/environment'

type CookieContext = { req?: { headers: { cookie?: string } } }

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[environment.csrfCookieName]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}
