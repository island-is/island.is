import * as faker from 'faker'
import { ApiScopesDTO } from '../../lib/resources/dto/api-scopes.dto'

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
    order: 0,
    showInDiscoveryDocument: true,
    required: false,
    emphasize: false,
    grantToLegalGuardians: false,
    grantToProcuringHolders: false,
    allowExplicitDelegationGrant: true,
    automaticDelegationGrant: false,
    alsoForDelegatedUser: false,
    grantToPersonalRepresentatives: false,
    domainName: faker.random.word(),
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
