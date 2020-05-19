import { CookieOptions } from 'express'

import { environment } from '../../../environments/environment'
import { Cookie } from './types'

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

export const PAYLOAD_COOKIE: Cookie = {
  name: 'gjafakort.token',
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

export const SIGNATURE_COOKIE: Cookie = {
  name: 'gjafakort.signature',
  options: defaultCookieOptions,
}
