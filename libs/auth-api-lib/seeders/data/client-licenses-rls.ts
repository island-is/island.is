import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/licenses:firearm',
    displayName: 'RLS digital license update scope',
    description:
      'Veitir aðgang að uppfærsluvirkni á skírteinum útgefnum af RLS',
  }),
  createClient({
    clientId: '@rls.is/clients/licenses',
    clientType: 'machine',
    displayName: 'RLS digital license machine client',
    description: 'Enables acccess to the license-api',
    allowedScopes: [
      'openid',
      '@island.is/licenses:firearm',
      '@island.is/licenses:verify',
    ],
  }),
)
