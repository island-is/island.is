import * as faker from 'faker'
import { Client, ClientType } from '@island.is/auth-api-lib'

export type CreateClient = Pick<
  Client,
  | 'clientId'
  | 'clientName'
  | 'nationalId'
  | 'clientType'
  | 'domainName'
  | 'supportsCustomDelegation'
  | 'supportsLegalGuardians'
  | 'supportsProcuringHolders'
  | 'supportsPersonalRepresentatives'
  | 'requireApiScopes'
> & {
  redirectUris?: string[]
  postLogoutRedirectUris?: string[]
  allowedGrantTypes?: string[]
  claims?: { type: string; value: string }[]
}

const createRandomClient = (): CreateClient => {
  return {
    clientId: faker.random.word(),
    nationalId: faker.datatype.string(10),
    clientType: ClientType.web,
    clientName: faker.random.word(),
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
