import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const drivingLicenseModule: ServicePortalModule = {
  name: 'Ökuréttindi',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:driving-license',
        defaultMessage: 'Ökuréttindi',
      }),
      path: ServicePortalPath.DrivingLicense,
      render: () => lazy(() => import('./screens/DrivingLicense')),
    },
  ],
}
