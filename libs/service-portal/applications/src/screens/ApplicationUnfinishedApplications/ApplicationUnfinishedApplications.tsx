import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalPath,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'

export const ApplicationUnfinishedApplications: ServicePortalModuleComponent = () => {
  useNamespaces('sp.application')

  return <div>applications</div>
}

export default ApplicationUnfinishedApplications
