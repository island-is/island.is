import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

const OpenApplications = () => <h1>Opnar umsóknir</h1>
const NewApplication = () => <h1>Ný umsókn</h1>
const NotFound = () => <h1>404</h1>

export const ServicePortalApplications: ServicePortalModuleComponent = () => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path="/umsoknir/opnar-umsoknir"
          component={OpenApplications}
        />
        <Route exact path="/umsoknir/ny-umsokn" component={NewApplication} />

        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default ServicePortalApplications
