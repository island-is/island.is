import { compose, createScope } from './helpers'

export const up = compose(
  createScope({
    name: '@rettarvorslugatt.island.is/law-and-order',
    displayName: 'Dómsmál og fyrirköll',
    description: 'Bakendascope fyrir dómsmála virkni á mínum síðum',
    accessControlled: false,
    addToClients: ['@island.is/clients/api'],
    addToResource: '@island.is',
  }),
)
