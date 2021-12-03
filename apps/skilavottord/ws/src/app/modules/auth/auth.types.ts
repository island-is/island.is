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

// TODO: replace with enum and compare to enum values instead of strings when this is used
export type Role =
  | 'developer'
  | 'citizen'
  | 'recyclingCompany'
  | 'recyclingFund'

export type Credentials = {
  user: AuthUser
  csrfToken: string
}
