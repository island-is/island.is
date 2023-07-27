import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/regulations',
    displayName: 'Reglugerðir Admin - Create',
    description: 'Búa til reglugerð',
    addToResource: '@admin.island.is',
    addToClients: ['@admin.island.is/web'],
    accessControlled: true,
    delegation: {
      custom: true,
      procuringHolders: true,
      legalGuardians: false,
    },
  }),
  createScope({
    name: '@admin.island.is/regulations:manage',
    displayName: 'Reglugerðir Admin - Editors',
    description: 'Búa til reglugerð, breyta og skoða',
    addToResource: '@admin.island.is',
    addToClients: ['@admin.island.is/web'],
    accessControlled: true,
    delegation: {
      custom: true,
      procuringHolders: true,
      legalGuardians: false,
    },
  }),
)
