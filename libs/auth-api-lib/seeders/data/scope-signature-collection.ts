import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/signature-collection:municipality',
    displayName: 'Meðmælakerfi Admin - Municipalities',
    description: 'Umsjón sveitarfélaga með söfnum meðmæla og úrvinnsla',
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
    name: '@admin.island.is/signature-collection:process',
    displayName: 'Meðmælakerfi Admin',
    description: 'Umsjón með söfnunum meðmæla og úrvinnsla',
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
    name: '@admin.island.is/signature-collection:manage',
    displayName: 'Meðmælakerfi Admin - Editors',
    description: 'Umsjón með söfnunum meðmæla og þjónsustuðningur',
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
    name: '@island.is/signature-collection',
    displayName: 'Meðmælasöfnun',
    description: 'Umsjón með söfnun meðmæla fyrir framboð',
    delegation: {
      custom: true,
      legalGuardians: false,
      procuringHolders: false,
    },
    accessControlled: false,
    addToResource: '@island.is',
    addToClients: ['@island.is/web'],
  }),
)
