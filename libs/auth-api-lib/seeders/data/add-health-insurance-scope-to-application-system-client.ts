import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/application-system',
    scopeNames: ['@sjukra.is/minarsidur'],
  }),
)
