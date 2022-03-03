import React from 'react'
import { Redirect } from 'react-router-dom'

import { useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance')

  return <Redirect to={ServicePortalPath.FinanceStatus} />
}

export default FinanceOverview
