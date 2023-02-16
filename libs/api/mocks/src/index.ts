import * as cms from './domains/cms'
import * as search from './domains/search'
import * as applications from './domains/applications'
import * as finance from './domains/finance'
import * as assets from './domains/assets'
import * as airDiscount from './domains/air-discount-scheme'
import { createGraphqlHandler, startMocking } from '@island.is/shared/mocking'
import { resolvers } from './resolvers'
import { schema } from './schema'

if (process.env.API_MOCKS === 'true') {
  startMocking([createGraphqlHandler({ resolvers, schema })])
}

export { cms, search, applications, finance, assets, airDiscount }
