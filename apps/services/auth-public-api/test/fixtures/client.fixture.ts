import * as faker from 'faker'
import { Client } from '@island.is/auth-api-lib'

export type CreateClient = Pick<
  Client,
  'clientId' | 'nationalId' | 'clientType'
>

const createRandomClient = (): CreateClient => {
  return {
    clientId: faker.random.word(),
    nationalId: faker.datatype.string(10),
    clientType: 'web',
  }
}

export const createClient = (client?: Partial<CreateClient>) => {
  const fallback = createRandomClient()
  return {
    ...fallback,
    ...client,
  }
}
