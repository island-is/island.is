import { createScope } from './helpers'

export const up = createScope({
  // Required:
  name: '@island.is/internal:procuring',
  displayName: 'Generic internal API scope for procuring holders',
  description:
    'Shared scope for interal usage in cases of delegation for procuring holders',

  // Optional:
  delegation: {
    procuringHolders: true,
  },
  accessControlled: false,
  addToResource: '@island.is',
  addToClients: ['@island.is/clients/application-system'],
})
