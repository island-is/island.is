import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { ModuleIdentifiers } from '@island.is/portals/core'

export const educationStudentAssessmentModule: ServicePortalModule = {
  id: ModuleIdentifiers.EDUCATION_STUDENT_ASSESSMENT,
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
