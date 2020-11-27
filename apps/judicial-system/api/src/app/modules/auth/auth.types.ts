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

export type VerifyResult = {
  user?: VerifiedUser
}

export type VerifiedUser = {
  kennitala: string
  fullname: string
  mobile: string
  authId: string
}

export type Credentials = {
  user: User
  csrfToken: string
}
