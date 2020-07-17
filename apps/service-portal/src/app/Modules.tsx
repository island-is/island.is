import React, { FC, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { useStateValue } from '../stateProvider'

const ModuleLoader: FC<{ module: ServicePortalModule }> = React.memo(
  ({ module }) => {
    console.log('module loader')
    const App = module.render()

    if (App)
      // TODO: Better loader
      return (
        <Suspense fallback={<SkeletonLoader />}>
          <App />
        </Suspense>
      )

    // TODO: Fallback
    return null
  },
)

const Modules: FC<{}> = () => {
  const [{ modules }] = useStateValue()

  return (
    <>
      <Route
        path="/umsoknir"
        render={() => <ModuleLoader module={modules.applicationsModule} />}
      />
    </>
  )
}

export default Modules
