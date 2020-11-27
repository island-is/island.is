export type AuthUser = {
  nationalId: string
  mobile: string
  name: string
}

export type CookieOptions = {
  secure: boolean
  httpOnly: boolean
  sameSite: string
}

export type Cookie = {
  name: string
  options: CookieOptions
}

export type Role =
  | 'developer'
  | 'citizen'
  | 'recyclingCompany'
  | 'recyclingFund'

export type Credentials = {
  user: AuthUser
  csrfToken: string
}
