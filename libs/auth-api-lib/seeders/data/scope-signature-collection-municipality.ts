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
)
