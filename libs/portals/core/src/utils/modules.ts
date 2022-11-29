import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import flatten from 'lodash/flatten'
import type { User } from '@island.is/shared/types'
import { FeatureFlagClient } from '@island.is/react/feature-flags'
import type { PortalModule, PortalRoute } from '../types/portalCore'

interface FilterEnabledModulesArgs<ModulesKeys extends string> {
  modules: Record<ModulesKeys, PortalModule>
  featureFlagClient: FeatureFlagClient
  companyModules?: ModulesKeys[]
  userInfo: User | null
}

export const filterEnabledModules = async <ModulesKeys extends string>({
  modules,
  companyModules,
  featureFlagClient,
  userInfo,
}: FilterEnabledModulesArgs<ModulesKeys>) => {
  const filteredModules = {} as Record<ModulesKeys, PortalModule>
  const isCompany = userInfo?.profile?.subjectType === 'legalEntity'
  const moduleEntries = Object.entries(modules) as [ModulesKeys, PortalModule][]

  for (const [moduleKey, module] of moduleEntries) {
    let enabled = true

    if (enabled && isCompany && !companyModules?.includes(moduleKey)) {
      enabled = false
    }

    if (enabled && module.featureFlag) {
      enabled = Boolean(
        await featureFlagClient.getValue(module.featureFlag, false),
      )
    }

    if (enabled) {
      filteredModules[moduleKey] = module
    }
  }

  return filteredModules
}

interface ArrangeRoutesArgs {
  userInfo: User
  modules: PortalModule[]
  apolloClient: ApolloClient<NormalizedCacheObject>
  featureFlagClient: FeatureFlagClient
}

export const arrangeRoutes = async ({
  userInfo,
  modules,
  apolloClient,
  featureFlagClient,
}: ArrangeRoutesArgs) => {
  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
  const routes = await Promise.all(
    Object.values(modules).map((module) => {
      const routesObject =
        module.companyRoutes && IS_COMPANY
          ? module.companyRoutes
          : module.routes
      return routesObject({
        userInfo,
        client: apolloClient,
      })
    }),
  )

  const flatRoutes = flatten(routes)
  const mappedRoutes = await Promise.all(
    flatRoutes.map(async (route) => {
      if (route.key) {
        const ff = await featureFlagClient.getValue(
          `isServicePortal${route.key}PageEnabled`,
          false,
        )
        return ff ? route : false
      }
      return route
    }),
  )
  const filteredRoutes = mappedRoutes.filter(Boolean) as PortalRoute[]

  return filteredRoutes
}
