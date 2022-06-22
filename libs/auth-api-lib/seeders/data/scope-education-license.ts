// scope-test.ts
import { createScope } from './helpers'

export const up = createScope({
  // Required:
  name: '@island.is/education-license',
  displayName: 'Starfsleyfi',
  description: 'Aðgangur að starfsleyfum',

  // Optional:
  delegation: {
    legalGuardians: true,
  },
  accessControlled: false,
  addToResource: '@island.is',
  addToClients: ['@island.is/web'],
})
