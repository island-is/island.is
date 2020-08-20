import cookies from 'next-cookies'

import { CSRF_COOKIE_NAME } from '@island.is/air-discount-scheme/consts'

type CookieContext = { req?: { headers: { cookie?: string } } }

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[CSRF_COOKIE_NAME]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}
