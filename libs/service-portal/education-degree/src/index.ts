import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const educationDegreeModule: ServicePortalModule = {
  name: 'Prófgráður',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:educationDegree',
        defaultMessage: 'Prófgráður',
      }),
      path: ServicePortalPath.EducationDegree,
      render: () => lazy(() => import('./screens/EducationDegree')),
    },
  ],
}
