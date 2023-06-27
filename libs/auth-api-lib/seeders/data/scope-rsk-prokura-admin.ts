import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@rsk.is/prokura:admin',
    displayName: 'Skatturinn prókúra admin',
    description:
      'Veitir aðgang að admin endapunktum í prókúru vefþjónustu Skattsins.',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
    addToClients: ['@island.is/clients/api', '@island.is/clients/dev'],
    addToResource: '@rsk.is/prokura',
  }),
  createClient({
    clientId: '@rsk.is/test-web',
    clientType: 'web',
    displayName: 'Skatturinn test web client',
    description:
      'A test web client for Skatturinn to get access tokens with delegations to test APIs.',
    allowedScopes: ['openid', '@rsk/prokura', '@rsk/prokura:admin'],
    supportDelegations: true,
  }),
)
