import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { ModuleIdentifiers } from '@island.is/portals/core'

export const educationCareerModule: ServicePortalModule = {
  id: ModuleIdentifiers.EDUCATION_CAREER,
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
