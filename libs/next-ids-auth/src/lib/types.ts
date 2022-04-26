import { Session, User } from 'next-auth'

export type AuthUser = User & {
  nationalId: string
  accessToken: string
  refreshToken: string
  idToken: string
}

export type AuthSession = Session & {
  idToken: string
  scope: string[]
}
