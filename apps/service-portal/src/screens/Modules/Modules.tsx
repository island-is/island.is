import React, { FC, Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import {
  ServicePortalRoute,
  NotFound,
  AccessDenied,
  PlausiblePageviewDetail,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { User } from 'oidc-client'

const RouteComponent: FC<{
  route: ServicePortalRoute
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ route, userInfo, client }) => {
  const location = useLocation()

  useEffect(() => {
    if (route.render !== undefined) {
      PlausiblePageviewDetail(route.path)
    }
  }, [location])
  if (route.render === undefined) return null

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
})

const RouteLoader: FC<{
  routes: ServicePortalRoute[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ routes, userInfo, client }) => (
  <Switch>
    {routes.map((route) =>
      route.enabled === false ? (
        <Route
          key={Array.isArray(route.path) ? route.path[0] : route.path}
          path={route.path}
          component={AccessDenied}
        />
      ) : (
        <Route
          path={route.path}
          exact
          key={Array.isArray(route.path) ? route.path[0] : route.path}
          render={() => (
            <RouteComponent route={route} userInfo={userInfo} client={client} />
          )}
        />
      ),
    )}
    {routes.length > 0 && <Route component={NotFound} />}
  </Switch>
))

const Modules: FC<{}> = () => {
  const [{ routes }] = useStore()
  const { userInfo, client } = useModuleProps()

  return (
    <Box paddingY={1}>
      {userInfo && (
        <RouteLoader routes={routes} userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}

export default Modules
