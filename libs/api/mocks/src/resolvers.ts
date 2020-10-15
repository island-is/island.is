import merge from 'lodash/merge'
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'
import { resolvers as cmsResolvers } from './domains/cms'
import { resolvers as searchResolvers } from './domains/search'

export const resolvers = createResolvers<Resolvers>(
  merge({}, cmsResolvers, searchResolvers),
)
