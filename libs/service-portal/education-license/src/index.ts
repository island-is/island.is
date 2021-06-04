import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const educationLicenseModule: ServicePortalModule = {
  name: 'Leyfisbréf',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:educationLicense',
        defaultMessage: 'Leyfisbréf',
      }),
      path: ServicePortalPath.EducationLicense,
      render: () => lazy(() => import('./screens/EducationLicense')),
    },
  ],
}
