import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/icelandic-names-registry',
    displayName: 'Mannanafnaskrá',
    description: 'Sýsla með íslensk mannanöfn',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      custom: true,
      procuringHolders: true,
    },
  }),
)
