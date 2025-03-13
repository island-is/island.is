import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: ['@mms.is/framhaldsskolaumsokn'],
  }),
  addScopesToClient({
    clientId: '@island.is/clients/application-system',
    scopeNames: ['@mms.is/framhaldsskolaumsokn'],
  }),
)
