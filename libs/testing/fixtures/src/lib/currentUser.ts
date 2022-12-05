import * as faker from 'faker'

import { AuthDelegationType, User } from '@island.is/auth-nest-tools'

import { createNationalId } from './nationalId'
import type { NationalIdType } from './nationalId'

interface UserOptions {
  sub?: string
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
}

export const createCurrentUser = (user: UserOptions = {}): User => {
  const delegationType =
    user.delegationType && !Array.isArray(user.delegationType)
      ? [user.delegationType]
      : user.delegationType
  const actor =
    delegationType || user.actor
      ? { nationalId: createNationalId('person'), scope: [], ...user.actor }
      : undefined

  return {
    sub: user.sub ?? faker.random.word(),
    nationalId: user.nationalId ?? createNationalId(user.nationalIdType),
    scope: user.scope ?? [],
    authorization: user.authorization ?? faker.random.word(),
    client: user.client ?? faker.random.word(),
    delegationType,
    actor,
  }
}
