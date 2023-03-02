import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/auth:admin',
    displayName: 'Innskráningarkerfi',
    description: '',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      procuringHolders: true,
    },
  }),
)
