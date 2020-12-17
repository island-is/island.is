import merge from 'lodash/merge'
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'
import { resolvers as cmsResolvers } from './domains/cms'
import { resolvers as searchResolvers } from './domains/search'
import { resolvers as applicationsResolvers } from './domains/applications'
import { resolvers as documentsResolvers } from './domains/documents'
import { resolvers as nationalRegistryResolvers } from './domains/national-registry'
import { resolvers as userProfileResolvers } from './domains/user-profile'

export const resolvers = createResolvers<Resolvers>(
  merge(
    {},
    cmsResolvers,
    searchResolvers,
    applicationsResolvers,
    documentsResolvers,
    nationalRegistryResolvers,
    userProfileResolvers,
  ),
)
