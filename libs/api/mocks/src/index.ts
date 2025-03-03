import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

if (process.env.API_MOCKS === 'true') {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}

export const setupNativeMocking = async () => {
  await import('./polyfills.native')
  const { setupServer } = await import('msw/native')
  const server = setupServer(createGraphqlHandler({ resolvers, schema }))
  server.listen({ onUnhandledRequest: 'bypass' })
  return server
}
