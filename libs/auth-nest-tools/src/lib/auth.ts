import { JwtAct } from './jwt.payload'

import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

export interface Auth {
  sub?: string
  sid?: string
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
  delegationProvider?: AuthDelegationProvider
  acr?: string
  idp?: string
  /** Preserved across an identity switch, so not on its own proof of a fresh authentication. */
  authTime?: Date
}
