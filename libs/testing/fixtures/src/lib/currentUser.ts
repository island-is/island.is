import * as faker from 'faker'

import { User } from '@island.is/auth-nest-tools'

interface CreateCurrentUser {
  nationalId: string
  scope: string[]
  authorization: string
  client: string
}

const createRandomCurrentUser = (): User => ({
  nationalId: faker.datatype
    .number({ min: 1000000000, max: 9999999999 })
    .toString(),
  scope: [],
  authorization: faker.random.word(),
  client: faker.random.word(),
})

export const createCurrentUser = (
  user: CreateCurrentUser = createRandomCurrentUser(),
): User => {
  const fallback = createRandomCurrentUser()

  const {
    nationalId = user['nationalId'] ?? fallback['nationalId'],
    scope = user['scope'] ?? fallback['scope'],
    authorization = user['authorization'] ?? fallback['authorization'],
    client = user['client'] ?? fallback['client'],
  } = user

  return {
    nationalId,
    scope,
    authorization,
    client,
  }
}
