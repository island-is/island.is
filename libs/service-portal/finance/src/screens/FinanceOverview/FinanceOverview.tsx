import { Navigate } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'

export const FinanceOverview = () => {
  useNamespaces('sp.finance')

  return <Navigate to={ServicePortalPath.FinanceStatus} replace />
}

export default FinanceOverview
