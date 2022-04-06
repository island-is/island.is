import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const vehiclesModule: ServicePortalModule = {
  name: 'Ökutæki',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Ökutæki',
      path: ServicePortalPath.AssetsVehicles,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
