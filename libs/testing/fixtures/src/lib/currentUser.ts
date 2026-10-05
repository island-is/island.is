import * as faker from 'faker'

import { User } from '@island.is/auth-nest-tools'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { createNationalId } from './nationalId'
import type { NationalIdType } from './nationalId'

interface UserOptions {
  nationalId?: string
  scope?: string[]
  authorization?: string
  client?: string
  nationalIdType?: NationalIdType
  delegationType?: AuthDelegationType | AuthDelegationType[]
  actor?: {
    nationalId?: string
    scope?: string[]
  }
  audkenniSimNumber?: string
  delegationProvider?: AuthDelegationProvider
  /** Authentication Context Class Reference, e.g. `eidas-loa-high`. */
  acr?: string
  /** Authentication Methods References, e.g. `['hwk', 'pin']`. */
  amr?: string[]
  /** When the user authenticated. */
  authTime?: Date
  sub?: string
  sid?: string
  ip?: string
  userAgent?: string
}

export const createCurrentUser = (user: UserOptions = {}): User => {
  // TODO: Simplify when web has strict TypeScript.
  const delegationType =
    user.delegationType &&
    ((!Array.isArray(user.delegationType)
      ? [user.delegationType]
      : user.delegationType) as AuthDelegationType[])
  const actor =
    delegationType || user.actor
      ? { nationalId: createNationalId('person'), scope: [], ...user.actor }
      : undefined

  return {
    nationalId: user.nationalId ?? createNationalId(user.nationalIdType),
    scope: user.scope ?? [],
    authorization: user.authorization ?? faker.random.word(),
    client: user.client ?? faker.random.word(),
    delegationType,
    actor,
    audkenniSimNumber: user.audkenniSimNumber,
    delegationProvider: user.delegationProvider,
    acr: user.acr,
    amr: user.amr,
    authTime: user.authTime,
    sub: user.sub,
    sid: user.sid,
    ip: user.ip,
    userAgent: user.userAgent,
  }
}
