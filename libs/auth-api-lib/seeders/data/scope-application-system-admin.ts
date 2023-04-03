import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/application-system',
    displayName: 'Umsóknarkerfi Ísland.is',
    description: 'Umsjón með umsóknir',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
