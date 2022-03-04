import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const drivingLicenseModule: ServicePortalModule = {
  name: 'Ökuréttindi',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.drivingLicense,
      path: ServicePortalPath.DrivingLicense,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/DrivingLicense')),
    },
  ],
}
