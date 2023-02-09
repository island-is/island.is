import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

const EducationDegree = lazy(() =>
  import('./screens/EducationDegree/EducationDegree'),
)

export const educationDegreeModule: ServicePortalModule = {
  name: 'Prófgráður',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.educationDegree,
      path: ServicePortalPath.EducationDegree,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationDegree />,
    },
  ],
}
