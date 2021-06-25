import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

const EdicationLicenseOld: ServicePortalModuleComponent = () => {
  return <Redirect to={ServicePortalPath.EducationLicense} />
}
export default EdicationLicenseOld
