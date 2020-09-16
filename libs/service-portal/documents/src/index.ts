import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const documentsModule: ServicePortalModule = {
  name: 'Rafræn skjöl',
  widgets: () => [],
  routes: () => [
    {
      name: 'Rafræn skjöl',
      path: ServicePortalPath.RafraenSkjolRoot,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
