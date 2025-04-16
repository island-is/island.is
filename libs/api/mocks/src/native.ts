import { createGraphqlHandler } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

export const setupNativeMocking = async () => {
  await import('./polyfills.native')
  const { setupServer } = await import('msw/native')
  const server = setupServer(createGraphqlHandler({ resolvers, schema }))
  server.listen({ onUnhandledRequest: 'bypass' })
  return server
}
