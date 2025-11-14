import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: ['@samgongustofa.is/leyfur'],
  }),
  addScopesToClient({
    clientId: '@island.is/clients/application-system',
    scopeNames: ['@samgongustofa.is/leyfur'],
  }),
)
