import React from 'react'
import { useNamespaces } from '@island.is/localization'
import { Navigate } from 'react-router-dom'
import { EducationPaths } from '../../lib/paths'
import { PortalModuleComponent } from '@island.is/portals/core'

export const EducationOverview: PortalModuleComponent = () => {
  useNamespaces('sp.education')

  return <Navigate to={EducationPaths.EducationAssessment} replace />
}

export default EducationOverview
