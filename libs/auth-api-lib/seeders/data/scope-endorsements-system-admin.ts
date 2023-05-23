// scope-test.ts
import { compose, createScope } from './helpers'
export const up = compose(
  createScope({
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
    addToClients: ['@island.is/web'],
  }),
  createScope({
    name: '@admin.island.is/petitions',
    displayName: 'Undirskriftalistar',
    description: 'Umsjón með undirskriftalistum.',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
