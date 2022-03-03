import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'

import * as applications from './domains/applications'
import * as assets from './domains/assets'
import * as cms from './domains/cms'
import * as finance from './domains/finance'
import * as search from './domains/search'
import { resolvers } from './resolvers'
import { schema } from './schema'

if (process.env.API_MOCKS === 'true') {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}

export { applications, assets,cms, finance, search }
