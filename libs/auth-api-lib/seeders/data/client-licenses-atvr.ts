import { compose, createClient } from './helpers'

export const up = compose(
  createClient({
    clientId: '@atvr.is/clients/licenses',
    clientType: 'machine',
    displayName: 'ATVR digital license machine client',
    description: 'Enables acccess to the license-api',
    allowedScopes: ['openid', '@island.is/licenses:verify'],
  }),
)
