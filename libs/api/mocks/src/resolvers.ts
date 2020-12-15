import merge from 'lodash/merge'
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'
import { resolvers as cmsResolvers } from './domains/cms'
import { resolvers as searchResolvers } from './domains/search'
import { resolvers as applicationsResolvers } from './domains/applications'

export const resolvers = createResolvers<Resolvers>(
  merge({}, cmsResolvers, searchResolvers, applicationsResolvers),
)
