import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const educationStudentAssessmentModule: ServicePortalModule = {
  name: 'Samræmd könnunarpróf',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:educationStudentAssessment',
        defaultMessage: 'Samræmd könnunarpróf',
      }),
      path: ServicePortalPath.EducationStudentAssessment,
      render: () => lazy(() => import('./screens/EducationStudentAssessment')),
    },
  ],
}
