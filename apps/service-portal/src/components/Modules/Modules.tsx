import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import { User } from 'oidc-client'

const ModuleLoader: FC<{
  module: ServicePortalModule
  userInfo: User
}> = React.memo(({ module, userInfo }) => {
  const App = module.render(userInfo)

  if (App)
    return (
      <Suspense fallback={<ModuleLoadingScreen name={module.name} />}>
        <ModuleErrorBoundary name={module.name}>
          <App userInfo={userInfo} />
        </ModuleErrorBoundary>
      </Suspense>
    )

  return <ModuleErrorScreen name={module.name} />
})

const Modules: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box paddingY={4} paddingX={3}>
      {modules.map((module) => (
        <Route
          path={module.path}
          key={module.path}
          render={() => <ModuleLoader module={module} userInfo={userInfo} />}
        />
      ))}
    </Box>
  )
}

export default Modules
