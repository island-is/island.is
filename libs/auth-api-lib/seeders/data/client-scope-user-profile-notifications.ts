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
)
