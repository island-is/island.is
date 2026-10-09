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
  /**
   * Authentication Context Class Reference of the authentication behind this
   * token, e.g. `eidas-loa-high` for electronic ID or `islandis-passkey` for
   * a passkey login. Undefined if the identity provider did not assert one.
   */
  acr?: string
  /** Authentication Methods References, e.g. `['hwk', 'pin']`. */
  amr?: string[]
  /**
   * When the end-user authenticated. Note that this is preserved across an
   * identity switch, so it is not on its own proof of a fresh authentication.
   */
  authTime?: Date
}
