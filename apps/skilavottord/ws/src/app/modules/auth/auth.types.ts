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

export enum Role {
  developer = 'developer',
  recyclingCompany = 'recyclingCompany',
  recyclingFund = 'recyclingFund',
  citizen = 'citizen',
}

export type Credentials = {
  user: AuthUser
  csrfToken: string
}

export type User = AuthUser & {
  role: Role
}
