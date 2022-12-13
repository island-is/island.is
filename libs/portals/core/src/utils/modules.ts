import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import flatten from 'lodash/flatten'
import type { User } from '@island.is/shared/types'
import { FeatureFlagClient } from '@island.is/react/feature-flags'
import type { PortalModule, PortalRoute } from '../types/portalCore'

interface FilterEnabledModulesArgs {
  modules: PortalModule[]
  featureFlagClient: FeatureFlagClient
  userInfo: User
}

export const filterEnabledModules = async ({
  modules,
  featureFlagClient,
  userInfo,
}: FilterEnabledModulesArgs) => {
  const filteredModules: PortalModule[] = []
  const isCompany = userInfo.profile?.subjectType === 'legalEntity'

  for (const module of modules) {
    let enabled = true

    if (module?.enabled) {
      enabled = module.enabled({ userInfo, isCompany })
    }

    if (enabled && module.featureFlag) {
      enabled = Boolean(
        await featureFlagClient.getValue(module.featureFlag, false),
      )
    }

    if (enabled) {
      filteredModules.push(module)
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
  const portalRoutes = modules.map((module) => {
    const routesObject =
      module.companyRoutes && IS_COMPANY ? module.companyRoutes : module.routes

    return routesObject({
      userInfo,
      client: apolloClient,
    })
  })

  const routes = await Promise.all(portalRoutes)
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
