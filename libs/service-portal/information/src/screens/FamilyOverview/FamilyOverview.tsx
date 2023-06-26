import { Navigate } from 'react-router-dom'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

const FamilyOverview: ServicePortalModuleComponent = () => {
  return <Navigate to={ServicePortalPath.MyInfoRoot} replace />
}

export default FamilyOverview
