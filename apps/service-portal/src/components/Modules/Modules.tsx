import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useStore } from '../../stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'
import { JwtToken } from '../../mirage-server/models/jwt-model'

const ModuleLoader: FC<{
  module: ServicePortalModule
  userInfo: JwtToken
}> = React.memo(({ module, userInfo }) => {
  const App = module.render(userInfo)

  if (App)
    return (
      <Suspense fallback={<ModuleLoadingScreen name={module.name} />}>
        <ModuleErrorBoundary name={module.name}>
          <App />
        </ModuleErrorBoundary>
      </Suspense>
    )

  return <ModuleErrorScreen name={module.name} />
})

const Modules: FC<{}> = () => {
  const [{ modules, userInfo }] = useStore()

  return (
    <Box paddingY={4} paddingX={3}>
      <Route
        path="/umsoknir"
        render={() => (
          <ModuleLoader
            module={modules.applicationsModule}
            userInfo={userInfo}
          />
        )}
      />
      <Route
        path="/stillingar"
        render={() => (
          <ModuleLoader module={modules.settingsModule} userInfo={userInfo} />
        )}
      />
      <Route
        path="/rafraen-skjol"
        render={() => (
          <ModuleLoader module={modules.documentsModule} userInfo={userInfo} />
        )}
      />
    </Box>
  )
}

export default Modules
