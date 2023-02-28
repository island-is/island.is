import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/ids-admin',
    displayName: 'IDS Admin',
    description: '',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
