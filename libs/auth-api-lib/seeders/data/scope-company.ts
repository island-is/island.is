// scope-test.ts
import { createScope } from './helpers'
export const up = createScope({
  // Required:
  name: '@island.is/company',
  displayName: 'Company API (RSK) Scope',
  description: 'Look up company info in RSK service',
  // Optional:
  delegation: {
    custom: false,
    legalGuardians: false,
    procuringHolders: true,
  },
  accessControlled: false,
  addToClients: ['@island.is/web'],
})
