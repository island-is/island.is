import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { ServicePortalModule, m } from '@island.is/service-portal/core'
import { EducationDegreePaths } from './lib/paths'

const EducationDegree = lazy(() =>
  import('./screens/EducationDegree/EducationDegree'),
)

export const educationDegreeModule: ServicePortalModule = {
  name: 'Prófgráður',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.educationDegree,
      path: EducationDegreePaths.EducationDegree,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationDegree />,
    },
  ],
}
