import { JwtAct, JwtDelegationType } from './jwt.payload'

export type AuthDelegationType = JwtDelegationType

export interface Auth {
  nationalId?: string
  scope: string[]
  authorization: string
  client: string
  actor?: {
    nationalId: string
    delegationType: AuthDelegationType
    scope: string[]
  }
  act?: JwtAct
  ip?: string
  userAgent?: string
}
