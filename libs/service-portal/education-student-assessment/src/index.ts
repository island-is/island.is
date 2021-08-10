import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationStudentAssessmentModule: ServicePortalModule = {
  name: 'Samræmd könnunarpróf',
  widgets: () => [],
  routes: () => [
    {
      name: m.educationStudentAssessment,
      path: ServicePortalPath.EducationStudentAssessment,
      render: () => lazy(() => import('./screens/EducationStudentAssessment')),
    },
  ],
}
