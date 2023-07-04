import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@admin.island.is/service-desk',
    displayName: 'Þjónustuborð',
    description: 'Gefur aðgang að þjónustuborði.',
    accessControlled: true,
    addToClients: ['@admin.island.is/web'],
    addToResource: '@admin.island.is',
    delegation: {
      procuringHolders: true,
    },
  }),
)
