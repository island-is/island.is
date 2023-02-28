import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/document-provider',
    displayName: 'Skjalaveita',
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
