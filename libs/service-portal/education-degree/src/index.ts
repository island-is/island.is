import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationDegreeModule: ServicePortalModule = {
  name: 'Prófgráður',
  widgets: () => [],
  routes: () => [
    {
      name: m.educationDegree,
      path: ServicePortalPath.EducationDegree,
      render: () => lazy(() => import('./screens/EducationDegree')),
    },
  ],
}
