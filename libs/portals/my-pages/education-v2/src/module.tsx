EducationV2Paths

import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: Education.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPaths.EducationAssessment} replace />,
    },
  ],
}
