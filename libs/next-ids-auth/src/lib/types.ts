import { User } from 'next-auth'
import { SessionBase } from 'next-auth/_utils'

export type AuthUser = User & {
  nationalId: string
  accessToken: string
  refreshToken: string
  idToken: string
}

export type AuthSession = SessionBase & {
  idToken: string
  scope: string[]
}
