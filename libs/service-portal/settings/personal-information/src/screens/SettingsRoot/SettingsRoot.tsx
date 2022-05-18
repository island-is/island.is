import React from 'react'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { Redirect } from 'react-router-dom'

export const SettingsRoot: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.SettingsPersonalInformation} />
}

export default SettingsRoot
