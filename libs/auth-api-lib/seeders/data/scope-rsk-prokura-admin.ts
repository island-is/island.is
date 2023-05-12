import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@rsk/prokura:admin',
    displayName: 'Skatturinn prókúra admin',
    description:
      'Veitir aðgang að admin endapunktum í prókúru vefþjónustu Skattsins.',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
    addToResource: '@rsk.is/prokura',
  }),
  createClient({
    clientId: '@rsk.is/test-web',
    clientType: 'web',
    displayName: 'Skatturinn test web client',
    description:
      'A test web client for Skatturinn to get access tokens with delegations to test APIs.',
    allowedScopes: ['openid', '@rsk/prokura', '@rsk/prokura:admin'],
  }),
)
