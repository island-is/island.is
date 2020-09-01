import React, { FC, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ServicePortalRoute } from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import NotFound from '../../screens/NotFound/NotFound'
import { UserWithMeta } from '@island.is/service-portal/core'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

const RouteComponent: FC<{
  route: ServicePortalRoute
  userInfo: UserWithMeta
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ route, userInfo, client }) => {
  const App = route.render({
    userInfo,
    client,
  })

  if (App)
    return (
      <Suspense fallback={<ModuleLoadingScreen name={route.name} />}>
        <ModuleErrorBoundary name={route.name}>
          <App userInfo={userInfo} client={client} />
        </ModuleErrorBoundary>
      </Suspense>
    )

  return <ModuleErrorScreen name={route.name} />
})

const RouteLoader: FC<{
  routes: ServicePortalRoute[]
  userInfo: UserWithMeta
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ routes, userInfo, client }) => (
  <Switch>
    {routes.map((route) => (
      <Route
        path={route.path}
        exact
        key={Array.isArray(route.path) ? route.path[0] : route.path}
        render={() => (
          <RouteComponent route={route} userInfo={userInfo} client={client} />
        )}
      />
    ))}
    {routes.length > 0 && <Route component={NotFound} />}
  </Switch>
))

const Modules: FC<{}> = () => {
  const [{ routes }] = useStore()
  const moduleProps = useModuleProps()

  return (
    <Box paddingY={1}>
      <RouteLoader routes={routes} {...moduleProps} />
    </Box>
  )
}

export default Modules
