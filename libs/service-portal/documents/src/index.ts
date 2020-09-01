import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const documentsModule: ServicePortalModule = {
  name: 'Rafræn skjöl',
  widgets: () => [
    {
      name: 'Rafræn skjöl',
      weight: 1,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: () => [
    {
      name: 'Rafræn skjöl',
      path: ServicePortalPath.RafraenSkjolRoot,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
