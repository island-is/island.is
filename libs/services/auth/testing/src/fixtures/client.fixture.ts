import * as faker from 'faker'
import { Client } from '@island.is/auth-api-lib'

export type CreateClient = Pick<
  Client,
  | 'clientId'
  | 'nationalId'
  | 'clientType'
  | 'supportsCustomDelegation'
  | 'supportsLegalGuardians'
  | 'supportsProcuringHolders'
  | 'supportsPersonalRepresentatives'
  | 'requireApiScopes'
>

const createRandomClient = (): CreateClient => {
  return {
    clientId: faker.random.word(),
    nationalId: faker.datatype.string(10),
    clientType: 'web',
    supportsCustomDelegation: false,
    supportsLegalGuardians: false,
    supportsProcuringHolders: false,
    supportsPersonalRepresentatives: false,
    requireApiScopes: false,
  }
}

export const createClient = (client?: Partial<CreateClient>) => {
  const fallback = createRandomClient()
  return {
    ...fallback,
    ...client,
  }
}
