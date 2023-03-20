import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createClient({
    clientId: '@island.is/system/notifications',
    clientType: 'machine',
    displayName: 'Notifications machine client',
    description: '',
    allowedScopes: [],
  }),
  createScope({
    name: '@island.is/user-profile:admin',
    displayName: 'user profile admin scope',
    description: '',
    addToClients: ['@island.is/system/notifications'],
  }),
  createScope({
    name: '@island.is/air-discount-scheme',
    displayName: 'air discount scheme public scope',
    description: 'Public facing Air Discount Scheme Scope',
    addToResource: '@island.is',
    addToClients: ['@island.is/web', '@island.is/clients/api'],
    delegation: {
      legalGuardians: true,
      custom: true,
    },
  }),
)
