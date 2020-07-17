import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useStore } from '../../stateProvider'
import ModuleLoadingScreen from './ModuleLoadingScreen'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'

const ModuleLoader: FC<{ module: ServicePortalModule }> = React.memo(
  ({ module }) => {
    const App = module.render()

    if (App)
      return (
        <Suspense fallback={<ModuleLoadingScreen name={module.name} />}>
          <ModuleErrorBoundary name={module.name}>
            <App />
          </ModuleErrorBoundary>
        </Suspense>
      )

    return <ModuleErrorScreen name={module.name} />
  },
)

const Modules: FC<{}> = () => {
  const [{ modules }] = useStore()

  return (
    <>
      <Route
        path="/umsoknir"
        render={() => <ModuleLoader module={modules.applicationsModule} />}
      />
      <Route
        path="/rafraen-skjol"
        render={() => <ModuleLoader module={modules.documentsModule} />}
      />
    </>
  )
}

export default Modules
