import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/licenses:disability',
    displayName: 'TR digital license update scope',
    description: 'Veitir aðgang að uppfærsluvirkni á skírteinum útgefnum af TR',
  }),
  createClient({
    clientId: '@tr.is/clients/licenses',
    clientType: 'machine',
    displayName: 'TR digital license machine client',
    description: 'Enables acccess to the license-api',
    allowedScopes: [
      'openid',
      '@island.is/licenses:disability',
      '@island.is/licenses:verify',
    ],
  }),
)
