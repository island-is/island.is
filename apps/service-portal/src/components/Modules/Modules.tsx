import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import {
  ServicePortalRoute,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import { JwtToken } from '../../mirage-server/models/jwt-model'

const RouteComponent: FC<{
  route: ServicePortalRoute
  userInfo: JwtToken
}> = ({ route, userInfo }) => {
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
}

const RouteLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: JwtToken
}> = React.memo(({ modules, userInfo }) => (
  <>
    {modules.map((module) =>
      module
        .routes(userInfo)
        .map((route) => (
          <Route
            exact
            path={route.path}
            key={route.path}
            render={() => <RouteComponent route={route} userInfo={userInfo} />}
          />
        )),
    )}
  </>
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
