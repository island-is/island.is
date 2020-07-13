import { CookieOptions } from 'express'

import {
  REDIRECT_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
} from '@island.is/gjafakort/consts'

import { environment } from '../../environments'
import { Cookie } from './types'

export const JWT_EXPIRES_IN_SECONDS = 1800

export const ONE_HOUR = 60 * 60 * 1000

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

export const REDIRECT_COOKIE: Cookie = {
  name: REDIRECT_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

export const CSRF_COOKIE: Cookie = {
  name: CSRF_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

export const ACCESS_TOKEN_COOKIE: Cookie = {
  name: ACCESS_TOKEN_COOKIE_NAME,
  options: defaultCookieOptions,
}
