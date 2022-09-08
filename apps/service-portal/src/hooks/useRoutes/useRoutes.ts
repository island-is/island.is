import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import flatten from 'lodash/flatten'
import { useLayoutEffect } from 'react'
import {
  ServicePortalModule,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'

import { Action, ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import { useModuleProps } from '../useModuleProps/useModuleProps'

export const useRoutes = () => {
  const [{ modules, modulesPending }, dispatch] = useStore()
  const { userInfo, client } = useModuleProps()
  const featureFlagClient = useFeatureFlagClient()

  const arrangeRoutes = async (
    userInfo: User,
    dispatch: (action: Action) => void,
    modules: ServicePortalModule[],
    client: ApolloClient<NormalizedCacheObject>,
  ) => {
    const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
    const routes = await Promise.all(
      Object.values(modules).map((module) => {
        const routesObject =
          module.companyRoutes && IS_COMPANY
            ? module.companyRoutes
            : module.routes
        return routesObject({
          userInfo,
          client,
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
    const filteredRoutes = mappedRoutes.filter(Boolean) as ServicePortalRoute[]

    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: filteredRoutes,
    })
  }

  useLayoutEffect(() => {
    if (userInfo === null || modulesPending) return
    arrangeRoutes(userInfo, dispatch, Object.values(modules), client)
  }, [userInfo, dispatch, modules, client])
}

export default useRoutes
