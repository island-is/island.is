import React from 'react'
import { Navigate } from 'react-router-dom'
import { useNamespaces } from '@island.is/localization'
import { TransportPaths } from '../..'

export const TransportsOverview = () => {
  useNamespaces('sp.vehicles')

  return <Navigate to={TransportPaths.AssetsMyVehicles} />
}

export default TransportsOverview
