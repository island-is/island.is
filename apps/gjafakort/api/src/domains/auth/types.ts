import { CookieOptions } from 'express'

export type VerifyResult = {
  user?: VerifiedUser
}

export type VerifiedUser = {
  kennitala: string
  fullname: string
  mobile: string
  authId: string
}

export type Cookie = {
  name: string
  options: CookieOptions
}

export type Permissions = {
  role?: 'admin'
}
