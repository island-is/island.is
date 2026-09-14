import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/download-service',
    scopeNames: ['@landlaeknir.is/health'],
  }),
)
