import cookies from 'next-cookies'

export const COOKIE_KEY = 'gjafakort.csrf'

type CookieContext = { req?: { headers: { cookie?: string } } }

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[COOKIE_KEY]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}
