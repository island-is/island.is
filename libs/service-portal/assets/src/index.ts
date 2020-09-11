import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const assetsModule: ServicePortalModule = {
  name: 'Eignir',
  widgets: () => [
    {
      name: 'Eignir',
      weight: 1,
      render: () => lazy(() => import('./widgets/AssetsCards')),
    },
  ],
  routes: () => [
    {
      name: 'Eignir',
      path: ServicePortalPath.EignirRoot,
      render: () => lazy(() => import('./lib/service-portal-assets')),
    },
  ],
}
