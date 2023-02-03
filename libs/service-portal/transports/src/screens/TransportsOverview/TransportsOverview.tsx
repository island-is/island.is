import React from 'react'
import { Navigate } from 'react-router-dom'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'
import { TransportPaths } from '../..'

export const TransportsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')

  return <Navigate to={TransportPaths.AssetsMyVehicles} />
}

export default TransportsOverview
