import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useModuleProps } from '../hooks/useModuleProps'
import { ModuleErrorScreen, ModuleErrorBoundary } from './ModuleErrorScreen'
import { AccessDenied } from './AccessDenied'
import { NotFound } from './NotFound'
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

type RouteLoaderProps = {
  routes: PortalRoute[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}

const RouteLoader = React.memo(
  ({ routes, userInfo, client }: RouteLoaderProps) => (
    <Switch>
      {routes.map((route) =>
        route.enabled === false ? (
          <Route
            path={route.path}
            exact
            key={Array.isArray(route.path) ? route.path[0] : route.path}
            component={AccessDenied}
          />
        ) : (
          <Route
            path={route.path}
            exact
            key={Array.isArray(route.path) ? route.path[0] : route.path}
            render={() => (
              <RouteComponent
                route={route}
                userInfo={userInfo}
                client={client}
              />
            )}
          />
        ),
      )}
      {routes.length > 0 && <Route component={NotFound} />}
    </Switch>
  ),
)

export const Modules = () => {
  const routes = useRoutes()
  const { userInfo, client } = useModuleProps()
  const modules = useModules()

  if (!userInfo) return null

  return (
    <Box paddingY={1}>
      {modules.length > 0 ? (
        <RouteLoader routes={routes} userInfo={userInfo} client={client} />
      ) : (
        <AccessDenied userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}
