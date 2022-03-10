import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import {
  ServicePortalModule,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { Action, ActionType } from '../../store/actions'
import { useModuleProps } from '../useModuleProps/useModuleProps'
import { User } from 'oidc-client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import flatten from 'lodash/flatten'

export const useRoutes = () => {
  const [{ modules, modulesPending }, dispatch] = useStore()
  const { userInfo, client } = useModuleProps()

  const arrangeRoutes = async (
    userInfo: User,
    dispatch: (action: Action) => void,
    modules: ServicePortalModule[],
    client: ApolloClient<NormalizedCacheObject>,
  ) => {
    const routes = await Promise.all(
      Object.values(modules).map((module) =>
        module.routes({
          userInfo,
          client,
        }),
      ),
    )

    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: flatten(routes),
    })
  }

  useEffect(() => {
    if (userInfo === null || modulesPending) return
    arrangeRoutes(userInfo, dispatch, Object.values(modules), client)
  }, [userInfo, dispatch, modules, client])

  useEffect(() => {
    if (!modulesPending) {
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
  }, [modulesPending])
}

export default useRoutes
