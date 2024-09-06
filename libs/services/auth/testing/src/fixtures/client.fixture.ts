import * as faker from 'faker'
import { Client, ClientAllowedScope, ClientType } from '@island.is/auth-api-lib'

export type CreateClient = Pick<
  Omit<Client, 'supportedDelegationTypes'>,
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
  | 'singleSession'
> & {
  redirectUris?: string[]
  postLogoutRedirectUris?: string[]
  allowedGrantTypes?: string[]
  claims?: { type: string; value: string }[]
  allowedScopes?: Pick<ClientAllowedScope, 'clientId' | 'scopeName'>[]
  supportedDelegationTypes?: string[]
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
    singleSession: false,
    supportedDelegationTypes: [],
  }
}

export const createClient = (client?: Partial<CreateClient>) => {
  const fallback = createRandomClient()
  return {
    ...fallback,
    ...client,
  }
}
