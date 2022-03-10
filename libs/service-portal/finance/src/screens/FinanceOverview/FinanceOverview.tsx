import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance')

  return <Redirect to={ServicePortalPath.FinanceStatus} />
}

export default FinanceOverview
