import merge from 'lodash/merge'
import { Resolvers } from './types'
import createFieldResolver from './createFieldResolver'
import { resolvers as cmsResolvers } from '../domains/cms'
import { resolvers as searchResolvers } from '../domains/search'

export const resolvers = createFieldResolver<Resolvers>(merge({}, cmsResolvers, searchResolvers))
