import React, { FC, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ServicePortalRoute } from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import NotFound from '../../screens/NotFound/NotFound'
import { UserWithMeta } from '@island.is/service-portal/core'

const RouteComponent: FC<{
  route: ServicePortalRoute
  userInfo: UserWithMeta
}> = React.memo(({ route, userInfo }) => {
  const App = route.render(userInfo)

  if (App)
    return (
      <Suspense fallback={<ModuleLoadingScreen name={route.name} />}>
        <ModuleErrorBoundary name={route.name}>
          <App userInfo={userInfo} />
        </ModuleErrorBoundary>
      </Suspense>
    )

  return <ModuleErrorScreen name={route.name} />
})

const RouteLoader: FC<{
  routes: ServicePortalRoute[]
  userInfo: UserWithMeta
}> = React.memo(({ routes, userInfo }) => (
  <Switch>
    {routes.map((route) => (
      <Route
        path={route.path}
        exact
        key={Array.isArray(route.path) ? route.path[0] : route.path}
        render={() => <RouteComponent route={route} userInfo={userInfo} />}
      />
    ))}
    <Route component={NotFound} />
  </Switch>
))

const Modules: FC<{}> = () => {
  const [{ routes, userInfo }] = useStore()

  return (
    <Box paddingY={4} paddingX={3}>
      <RouteLoader routes={routes} userInfo={userInfo} />
    </Box>
  )
}

export default Modules
