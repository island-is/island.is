import cookies from 'next-cookies'

const CSRF_COOKIE_NAME = 'skilavottord.csrf'

type CookieContext = { req?: { headers: { cookie?: string } } }

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[CSRF_COOKIE_NAME]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}
