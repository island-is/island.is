import { CookieOptions } from 'express'

export type Cookie = {
  name: string
  options: CookieOptions
}

export type Permissions = {
  role?: 'developer' | 'admin' | 'tester' | 'user'
}
