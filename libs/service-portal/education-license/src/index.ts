import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationLicenseModule: ServicePortalModule = {
  name: 'Leyfisbréf',
  widgets: () => [],
  routes: () => [
    {
      name: m.educationLicense,
      path: ServicePortalPath.EducationLicense,
      render: () => lazy(() => import('./screens/EducationLicense')),
    },
  ],
}
