import { JwtAct } from './jwt.payload'

export interface Auth {
  nationalId?: string
  scope: string[]
  authorization: string
  client: string
  actor?: {
    nationalId: string
    scope: string[]
  }
  act?: JwtAct
  ip?: string
  userAgent?: string
}
