import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@hms.is/housing-benefits',
    displayName: 'Húsnæðisbætur',
    description: 'Bakendascope fyrir húsnæðisbætur',
    addToClients: ['@island.is/clients/api'],
    accessControlled: false,
  }),
)
