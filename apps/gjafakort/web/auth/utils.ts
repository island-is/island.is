import jwtDecode from 'jwt-decode'
import cookies from 'next-cookies'

export const COOKIE_KEY = 'gjafakort.csrf'

export type DecodedToken = {
  readonly exp: number
  readonly csrfToken: string
}

export const getToken = (ctx: any) => {
  return cookies(ctx || {})[COOKIE_KEY]
}

export const decodeToken = (ctx: any): DecodedToken | null => {
  const token = getToken(ctx)

  if (!token) {
    return null
  }

  let decodedToken = null
  try {
    decodedToken = jwtDecode(token)
    // eslint-disable-next-line no-empty
  } catch {}

  return decodedToken
}

export const isAuthenticated = (ctx: any) => {
  return Boolean(getToken(ctx))
}
