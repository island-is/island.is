// scope-test.ts
import { createScope } from './helpers'
export const up = createScope({
  // Required:
  name: '@island.is/endorsements:admin',
  displayName: 'Endorsements Admin Scope ',
  description: 'Admin actions - lock unlock edit lists',
  // Optional:
  delegation: {
    custom: false,
    legalGuardians: false,
    procuringHolders: false,
  },
  accessControlled: true,
  addToResource: '@island.is',
  addToClients: ['island-is-1'],
})
