import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

import { m } from './lib/messages'

export const applicationsModule: ServicePortalModule = {
  name: m.heading,
  widgets: () => [],
  routes: () => {
    const applicationRoutes = [
      {
        name: m.heading,
        path: ServicePortalPath.ApplicationRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}
