import { Resolvers } from './types'
import createFieldResolver from './createFieldResolver'
import { resolvers as cmsResolvers } from '../domains/cms'

export const resolvers = createFieldResolver<Resolvers>({
  ...cmsResolvers,
})
