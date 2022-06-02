import { createScope } from './helpers'
export const up = createScope({
  // Required:
  name: '@island.is/vehicles',
  displayName: 'Vehicles Scope',
  description: 'Look up vehicular information from Samgöngustofa',
  // Optional:
  delegation: {
    custom: true,
    legalGuardians: false,
    procuringHolders: false,
  },
  accessControlled: false,
  addToResource: '@island.is',
  addToClients: ['@island.is/web'],
})
