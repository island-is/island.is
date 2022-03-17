import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

const FamilyOverview: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.FamilyRoot} />
}
export default FamilyOverview
