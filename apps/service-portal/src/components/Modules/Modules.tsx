import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useStore } from '../../stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { Box } from '@island.is/island-ui/core'

const ModuleLoader: FC<{
  module: ServicePortalModule
  activeSubjectId: string
}> = React.memo(({ module, activeSubjectId }) => {
  const moduleProps = {
    activeSubjectNationalId: activeSubjectId,
  }

  const App = module.render(moduleProps)

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
  const [{ modules, activeSubjectId }] = useStore()
  if (!activeSubjectId) return null

  return (
    <Box paddingY={4} paddingX={3}>
      <Route
        path="/umsoknir"
        render={() => (
          <ModuleLoader
            module={modules.applicationsModule}
            activeSubjectId={activeSubjectId}
          />
        )}
      />
      <Route
        path="/stillingar"
        render={() => (
          <ModuleLoader
            module={modules.settingsModule}
            activeSubjectId={activeSubjectId}
          />
        )}
      />
      <Route
        path="/rafraen-skjol"
        render={() => (
          <ModuleLoader
            module={modules.documentsModule}
            activeSubjectId={activeSubjectId}
          />
        )}
      />
    </Box>
  )
}

export default Modules
