import * as faker from 'faker'

import { User } from '@island.is/auth-nest-tools'

import { createNationalId } from './nationalId'
import type { NationalIdType } from './nationalId'

interface UserOptions {
  nationalId?: string
  scope?: string[]
  authorization?: string
  client?: string
  nationalIdType?: NationalIdType
}

export const createCurrentUser = (user: UserOptions = {}): User => {
  return {
    nationalId: user.nationalId ?? createNationalId(user.nationalIdType),
    scope: user.scope ?? [],
    authorization: user.authorization ?? faker.random.word(),
    client: user.client ?? faker.random.word(),
  }
}
