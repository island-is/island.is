import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'

export const drivingLicenseModule: ServicePortalModule = {
  name: 'Ökuréttindi',
  widgets: () => [],
  routes: () => [
    {
      name: m.drivingLicense,
      path: ServicePortalPath.DrivingLicense,
      render: () => lazy(() => import('./screens/DrivingLicense')),
    },
  ],
}
