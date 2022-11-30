import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { useModules } from '../components/ModulesProvider'
import { useModuleProps } from '../hooks/useModuleProps'
import { ModuleErrorScreen, ModuleErrorBoundary } from './ModuleErrorScreen'
import { AccessDenied } from './AccessDenied'
import { NotFound } from './NotFound'
import { PortalRoute } from '../types/portalCore'
import { usePortalMeta } from '../components/PortalMetaProvider'
import { plausiblePageviewDetail } from '../lib/plausiblePageviewDetail'

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
    }, [location])

    if (route.render === undefined) {
      return null
    }

    const App = route.render({
      userInfo,
      client,
    })

    if (App)
      return (
        <Suspense fallback={null}>
          <ModuleErrorBoundary name={route.name}>
            <App userInfo={userInfo} client={client} />
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
  const { routes } = useModules()
  const { userInfo, client } = useModuleProps()

  return (
    <Box paddingY={1}>
      {userInfo && (
        <RouteLoader routes={routes} userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}
