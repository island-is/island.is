import { JwtAct } from './jwt.payload'

import { AuthDelegationType } from '@island.is/shared/types'

export interface Auth {
  sub?: string
  nationalId?: string
  scope: string[]
  authorization: string
  client: string
  delegationType?: AuthDelegationType[]
  actor?: {
    nationalId: string
    scope: string[]
  }
  act?: JwtAct
  ip?: string
  userAgent?: string
  audkenniSimNumber?: string
}
