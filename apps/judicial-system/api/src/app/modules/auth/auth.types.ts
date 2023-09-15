import { CookieOptions } from 'express'

export type AuthUser = {
  nationalId: string
  name?: string
  mobile?: string
}

export type Cookie = {
  name: string
  options: CookieOptions
}
