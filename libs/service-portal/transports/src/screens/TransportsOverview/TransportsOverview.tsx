import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'

export const TransportsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')

  return <Redirect to={ServicePortalPath.TransportMyVehicles} />
}

export default TransportsOverview
