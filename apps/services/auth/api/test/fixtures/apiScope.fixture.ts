import * as faker from 'faker'
import { ApiScopesDTO } from '@island.is/auth-api-lib'

/**
 * Private helper to create ApiScope with random values.
 * @returns
 */
const createRandomApiScope = (): ApiScopesDTO => {
  return {
    enabled: true,
    name: faker.random.word(),
    displayName: faker.random.word(),
    description: faker.random.word(),
    domainName: faker.random.word(),
    showInDiscoveryDocument: true,
    required: false,
    emphasize: false,
    grantToLegalGuardians: false,
    grantToProcuringHolders: false,
    allowExplicitDelegationGrant: true,
    automaticDelegationGrant: false,
    alsoForDelegatedUser: false,
    grantToPersonalRepresentatives: false,
  }
}

/**
 * Creates ApiScope fixture to be used for testing.
 * @param apiScope Partial definition of the required ApiScopesDTO used for creating ApiScopes.
 *                 Give the user control to provide predfined values for some properties.
 * @returns
 */
export const createApiScope = (
  apiScope?: Partial<ApiScopesDTO>,
): ApiScopesDTO => {
  const fallback = createRandomApiScope()

  return {
    ...fallback,
    ...apiScope,
  }
}
