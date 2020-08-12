export type CookieOptions = {
  secure: boolean
  httpOnly: boolean
  sameSite: string
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

export type Permissions = {
  role?: 'developer' | 'admin' | 'tester' | 'user'
}

export type LogoutResponse = {
  logout: boolean
}
