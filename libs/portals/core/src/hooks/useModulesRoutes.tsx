import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { Suspense, useEffect } from 'react'
import { useLocation, RouteObject } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useModuleProps } from './useModuleProps'
import {
  ModuleErrorScreen,
  ModuleErrorBoundary,
} from '../screens/ModuleErrorScreen'
import { AccessDenied } from '../screens/AccessDenied'
import { PortalRoute } from '../types/portalCore'
import {
  useModules,
  usePortalMeta,
  useRoutes,
} from '../components/PortalProvider'
import { plausiblePageviewDetail } from '../utils/plausible'

type RouteComponentProps = {
  route: PortalRoute
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}
const RouteComponent = React.memo(
  ({ route, userInfo, client }: RouteComponentProps) => {
    const location = useLocation()
    const { basePath } = usePortalMeta()

    useEffect(() => {
      if (route.render !== undefined) {
        plausiblePageviewDetail({
          basePath,
          path: route.path,
        })
      }
    }, [basePath, location, route.path, route.render])

    if (route.render === undefined) {
      return null
    }

    const Module = route.render({
      userInfo,
      client,
    })

    if (Module)
      return (
        <Suspense fallback={null}>
          <ModuleErrorBoundary name={route.name}>
            <Module userInfo={userInfo} client={client} />
          </ModuleErrorBoundary>
        </Suspense>
      )

    return <ModuleErrorScreen name={route.name} />
  },
)

export const useModulesRoutes = (): RouteObject[] | null => {
  const routes = useRoutes()
  const { userInfo, client } = useModuleProps()
  const modules = useModules()

  if (!userInfo) return null

  if (modules.length === 0) {
    return [
      {
        path: '*',
        element: (
          <Box paddingY={1}>
            <AccessDenied />
          </Box>
        ),
      },
    ]
  }

  return routes.map((route) => {
    if (route.enabled === false) {
      return {
        ...route,
        element: (
          <Box paddingY={1}>
            <AccessDenied />
          </Box>
        ),
      }
    }

    return {
      ...route,
      element: (
        <Box paddingY={1}>
          <RouteComponent route={route} userInfo={userInfo} client={client} />
        </Box>
      ),
    }
  })
}
