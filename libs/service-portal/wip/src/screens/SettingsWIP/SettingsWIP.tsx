import React from 'react'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { Redirect } from 'react-router-dom'

export const SettingsWIP: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.SettingsPersonalInformation} />
}

export default SettingsWIP
