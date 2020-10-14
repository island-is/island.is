import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const assetsModule: ServicePortalModule = {
  name: 'Eignir',
  widgets: () => [],
  routes: () => [
    {
      name: 'Eignir',
      path: ServicePortalPath.EignirRoot,
      render: () =>
        lazy(() => import('./screens/AssetsOverview/AssetsOverview')),
    },
  ],
}
