import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { withClientLocale } from '@island.is/localization'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.FinanceStatus} />
}

export default withClientLocale('sp.finance')(FinanceOverview)
