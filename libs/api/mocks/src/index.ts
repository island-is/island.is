import * as cms from './domains/cms'
import * as search from './domains/search'
import * as applications from './domains/applications'
import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

const API_MOCKS_REQUESTED = process.env.API_MOCKS || process.env.NX_API_MOCKS
if (process.env.NODE_ENV !== 'production' && API_MOCKS_REQUESTED) {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}

export { cms, search, applications }
