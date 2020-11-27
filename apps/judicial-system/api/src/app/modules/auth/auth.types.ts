import { CookieOptions } from 'express'

import { User } from '@island.is/judicial-system/types'

export type AuthUser = {
  nationalId: string
  name: string
  mobile: string
}

export type Cookie = {
  name: string
  options: CookieOptions
}

export type Credentials = {
  user: User
  csrfToken: string
}
