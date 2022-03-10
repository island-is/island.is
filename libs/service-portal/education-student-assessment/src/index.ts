import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationStudentAssessmentModule: ServicePortalModule = {
  name: 'Samræmd könnunarpróf',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.educationStudentAssessment,
      path: ServicePortalPath.EducationStudentAssessment,
      enabled: userInfo.scopes.includes(ApiScope.education),
      render: () => lazy(() => import('./screens/EducationStudentAssessment')),
    },
  ],
}
