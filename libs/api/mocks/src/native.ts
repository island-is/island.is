import { createGraphqlHandler } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'
import { setupServer } from 'msw/native'
import './polyfills.native'

export const setupNativeMocking = async () => {
  const server = setupServer(createGraphqlHandler({ resolvers, schema }))
  server.listen({ onUnhandledRequest: 'bypass' })
  return server
}
