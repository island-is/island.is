import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@island.is/licenses:firearm',
    displayName: 'RLS digital firearm license update scope',
    description:
      'Veitir aðgang að uppfærsluvirkni á skotvopnaskírteinum útgefnum af RLS',
  }),
  createScope({
    name: '@island.is/licenses:driving',
    displayName: 'RLS digital driving license update scope',
    description:
      'Veitir aðgang að uppfærsluvirkni á ökuskírteinum útgefnum af RLS',
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
