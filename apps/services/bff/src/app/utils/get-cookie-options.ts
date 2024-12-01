import { CookieOptions } from 'express'
import { environment } from '../../environment'

export const getCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: true,
    // The lax setting allows cookies to be sent on top-level navigations (such as redirects),
    // while still providing some protection against CSRF attacks.
    sameSite: 'lax',
    path: environment.keyPath,
  }
}
