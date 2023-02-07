import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { arrangeRoutes, filterEnabledModules } from '../modules'
import { FeatureFlagClient } from '@island.is/feature-flags'
import { User } from '@island.is/shared/types'
import { PortalModule, PortalRoute } from '../../types/portalCore'

export type PrepareRouterDataProps = {
  userInfo: User
  featureFlagClient: FeatureFlagClient
  modules: PortalModule[]
  client: ApolloClient<NormalizedCacheObject>
}

export type PrepareRouterDataReturnType = {
  modules: PortalModule[]
  routes: PortalRoute[]
  userInfo: User
}

/**
 * This function is used to prepare/preload necessary data before we initialize our main router.
 */
export const prepareRouterData = async ({
  modules: initialModules,
  client,
  ...rest
}: PrepareRouterDataProps): Promise<PrepareRouterDataReturnType> => {
  const modules = await filterEnabledModules({
    modules: initialModules,
    ...rest,
  })

  const routes = await arrangeRoutes({
    modules: Object.values(modules),
    client,
    ...rest,
  })

  return {
    modules,
    routes,
    userInfo: rest.userInfo,
  }
}
