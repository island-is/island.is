import React, { FC, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  ServicePortalRoute,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import { User } from 'oidc-client'
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
  modules: ServicePortalModule[]
  userInfo: UserWithMeta
}> = React.memo(({ modules, userInfo }) => (
  <Switch>
    {modules.map((module) =>
      module
        .routes(userInfo)
        .map((route) => (
          <Route
            exact={!route.catchAll}
            path={route.path}
            key={route.path}
            render={() => <RouteComponent route={route} userInfo={userInfo} />}
          />
        )),
    )}
    <Route component={NotFound} />
  </Switch>
))

const Modules: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box paddingY={4} paddingX={3}>
      <RouteLoader modules={modules} userInfo={userInfo} />
    </Box>
  )
}

export default Modules
