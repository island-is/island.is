import merge from 'lodash/merge'
import { createResolvers } from '@island.is/shared/mocking'
import { Resolvers } from './types'
import { resolvers as cmsResolvers } from './domains/cms'
import { resolvers as searchResolvers } from './domains/search'
import { resolvers as applicationsResolvers } from './domains/applications'
import { resolvers as assetResolvers } from './domains/assets'
import { resolvers as authResolvers } from './domains/auth/resolvers'
import { resolvers as identityResolvers } from './domains/identity/resolvers'
import { resolvers as financeResolvers } from './domains/finance'
import { resolvers as licenseServiceResolvers } from './domains/license-service'
import { resolvers as airDiscountResolvers } from './domains/air-discount-scheme'
import { resolvers as rightsPortalPaymentResolver } from './domains/rights-portal'
import { resolvers as vehicleResolvers } from './domains/vehicles'
import { resolvers as healthDirectorateResolvers } from './domains/health-directorate'
import { resolvers as documentResolvers } from './domains/documents'
import { resolvers as nationalRegistryResolvers } from './domains/national-registry'
import { resolvers as userProfileResolvers } from './domains/user-profile'

export const resolvers = createResolvers<Resolvers>(
  merge(
    {},
    cmsResolvers,
    authResolvers,
    identityResolvers,
    searchResolvers,
    applicationsResolvers,
    assetResolvers,
    licenseServiceResolvers,
    financeResolvers,
    airDiscountResolvers,
    rightsPortalPaymentResolver,
    vehicleResolvers,
    healthDirectorateResolvers,
    documentResolvers,
    nationalRegistryResolvers,
    userProfileResolvers,
  ),
)
