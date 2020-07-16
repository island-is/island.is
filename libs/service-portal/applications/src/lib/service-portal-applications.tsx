import React from 'react'
import { ServicePortalModuleProps } from '@island.is/service-portal/core'
import { Route } from 'react-router-dom'

const Greeting = () => (
  <h1>Welcome to service-portal-applications component!</h1>
)
const OpenApplications = () => <h1>Opnar umsóknir</h1>
const NewApplication = () => <h1>Ný umsókn</h1>

export const ServicePortalApplications = (props: ServicePortalModuleProps) => {
  return (
    <div>
      <Route exact path="/umsoknir" component={Greeting} />
      <Route
        exact
        path="/umsoknir/opnar-umsoknir"
        component={OpenApplications}
      />
      <Route exact path="/umsoknir/ny-umsokn" component={NewApplication} />
    </div>
  )
}

export default ServicePortalApplications
