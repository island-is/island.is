import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

if (process.env.NODE_ENV === 'development' && process.env.API_MOCKS) {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}
