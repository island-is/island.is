import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationCareerModule: ServicePortalModule = {
  name: 'Námsferill',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.educationCareer,
      path: ServicePortalPath.EducationCareer,
      enabled: userInfo.scopes.includes(ApiScope.education),
      render: () => lazy(() => import('./screens/EducationCareer')),
    },
  ],
}
