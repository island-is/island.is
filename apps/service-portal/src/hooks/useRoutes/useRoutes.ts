import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import flatten from 'lodash/flatten'
import { useEffect } from 'react'

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
    const FEATURE_FLAG_COMPANY_VIEW = await featureFlagClient.getValue(
      'isServicePortalCompanyViewEnabled',
      false,
    )
    const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
    const routes = await Promise.all(
      Object.values(modules).map((module) => {
        const routesObject =
          module.companyRoutes && IS_COMPANY && FEATURE_FLAG_COMPANY_VIEW
            ? module.companyRoutes
            : module.routes
        return routesObject({
          userInfo,
          client,
        })
      }),
    )

    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: flatten(routes),
    })
  }

  const arrangeDynamicRoutes = async (
    userInfo: User,
    dispatch: (action: Action) => void,
    modules: ServicePortalModule[],
    client: ApolloClient<NormalizedCacheObject>,
  ) => {
    Promise.all(
      Object.values(modules)
        .filter((module) => module.dynamicRoutes)
        .map((module) => {
          if (module.dynamicRoutes) {
            return module.dynamicRoutes({
              userInfo,
              client,
            })
          }
        }),
    ).then((dynamicRoutes) => {
      if (dynamicRoutes.length > 0) {
        dispatch({
          type: ActionType.UpdateFulfilledRoutes,
          payload: flatten(dynamicRoutes) as ServicePortalRoute[],
        })
      }
    })
  }

  useEffect(() => {
    if (userInfo === null || modulesPending) return
    arrangeRoutes(userInfo, dispatch, Object.values(modules), client)
    arrangeDynamicRoutes(userInfo, dispatch, Object.values(modules), client)
  }, [userInfo, dispatch, modules, client])
}

export default useRoutes
