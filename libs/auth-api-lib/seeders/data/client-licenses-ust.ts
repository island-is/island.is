import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/licenses:hunting',
    displayName: 'UST digital license update scope',
    description:
      'Veitir aðgang að uppfærsluvirkni á skírteinum útgefnum af UST',
  }),
  createClient({
    clientId: '@ust.is/clients/licenses',
    clientType: 'machine',
    displayName: 'UST digital license machine client',
    description: 'Enables acccess to the license-api',
    allowedScopes: ['openid', '@island.is/licenses:hunting'],
  }),
)
