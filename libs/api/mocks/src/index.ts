import * as cms from './domains/cms'
import * as search from './domains/search'
import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

if (process.env.NODE_ENV !== 'production' && process.env.API_MOCKS) {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}

export { cms, search }
