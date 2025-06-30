import { FormatMessage } from '@island.is/localization'
import flatten from 'lodash/flatten'
import type { BffUser } from '@island.is/shared/types'
import { FeatureFlagClient } from '@island.is/react/feature-flags'
import type { PortalModule, PortalRoute } from '../types/portalCore'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

interface FilterEnabledModulesArgs {
  modules: PortalModule[]
  featureFlagClient: FeatureFlagClient
  userInfo: BffUser
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
  userInfo: BffUser
  modules: PortalModule[]
  featureFlagClient: FeatureFlagClient
  client: ApolloClient<NormalizedCacheObject>
  formatMessage: FormatMessage
}

export const arrangeRoutes = async ({
  userInfo,
  modules,
  featureFlagClient,
  client,
  formatMessage,
}: ArrangeRoutesArgs) => {
  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
  const portalRoutes = modules.map((module) => {
    const routesObject =
      module.companyRoutes && IS_COMPANY ? module.companyRoutes : module.routes

    return routesObject({
      userInfo,
      client,
      formatMessage,
      featureFlagClient,
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

  return mappedRoutes.filter(Boolean) as PortalRoute[]
}
