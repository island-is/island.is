import { CookieOptions } from 'express'

import { environment } from '../../environments'
import { Cookie } from './types'

export const JWT_EXPIRES_IN_SECONDS = 1800

export const FIFTEEN_MINUTES = 15 * 60 * 1000

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

export const REDIRECT_COOKIE: Cookie = {
  name: 'gjafakort.redirect',
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

export const CSRF_COOKIE: Cookie = {
  name: 'gjafakort.csrf',
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

export const ACCESS_TOKEN_COOKIE: Cookie = {
  name: 'gjafakort.token',
  options: defaultCookieOptions,
}
