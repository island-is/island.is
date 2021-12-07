import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationDegreeModule: ServicePortalModule = {
  name: 'Prófgráður',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.educationDegree,
      path: ServicePortalPath.EducationDegree,
      enabled: userInfo.scopes.includes(ApiScope.education),
      render: () => lazy(() => import('./screens/EducationDegree')),
    },
  ],
}
