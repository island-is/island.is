import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { Navigate } from 'react-router-dom-v5-compat'

export const SettingsRoot: ServicePortalModuleComponent = () => {
  return <Navigate to={ServicePortalPath.SettingsPersonalInformation} replace />
}

export default SettingsRoot
