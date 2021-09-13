import merge from 'lodash/merge'
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'
import { resolvers as cmsResolvers } from './domains/cms'
import { resolvers as searchResolvers } from './domains/search'
import { resolvers as applicationsResolvers } from './domains/applications'
import { resolvers as assetResolvers } from './domains/assets'
import { resolvers as financeResolvers } from './domains/finance'

export const resolvers = createResolvers<Resolvers>(
  merge(
    {},
    cmsResolvers,
    searchResolvers,
    applicationsResolvers,
    assetResolvers,
    financeResolvers,
  ),
)
