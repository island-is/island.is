import { Navigate } from 'react-router-dom'
import {
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance')

  return <Navigate to={ServicePortalPath.FinanceStatus} replace />
}

export default FinanceOverview
