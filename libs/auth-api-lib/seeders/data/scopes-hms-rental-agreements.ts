import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@hms.is/rental-agreements',
    displayName: 'Leigusamningar',
    description: 'bakendascope fyrir leigusamninga',
    addToClients: ['@island.is/clients/api'],
  }),
)
