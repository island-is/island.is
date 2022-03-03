import React from 'react'
import { Redirect } from 'react-router-dom'

import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const SettingsWIP: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.SettingsPersonalInformation} />
}

export default SettingsWIP
