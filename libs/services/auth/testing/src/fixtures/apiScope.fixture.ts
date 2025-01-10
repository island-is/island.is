import { ApiScopeDTO } from '@island.is/auth-api-lib'
import { faker } from '@faker-js/faker'

/**
 * Private helper to create ApiScope with random values.
 */
const createRandomApiScope = (): ApiScopeDTO => {
  return {
    enabled: true,
    name: faker.word.sample(),
    displayName: faker.word.sample(),
    description: faker.word.sample(),
    order: 0,
    showInDiscoveryDocument: true,
    required: false,
    emphasize: false,
    grantToAuthenticatedUser: true,
    grantToLegalGuardians: false,
    grantToProcuringHolders: false,
    allowExplicitDelegationGrant: true,
    automaticDelegationGrant: false,
    alsoForDelegatedUser: false,
    grantToPersonalRepresentatives: false,
    domainName: faker.word.sample(),
  }
}

/**
 * Creates ApiScope fixture to be used for testing.
 * @param apiScope Partial definition of the required ApiScopesDTO used for creating ApiScopes.
 *                 Give the user control to provide predefined values for some properties.
 */
export const createApiScope = (
  apiScope?: Partial<ApiScopeDTO>,
): ApiScopeDTO => {
  const fallback = createRandomApiScope()

  return {
    ...fallback,
    ...apiScope,
  }
}
