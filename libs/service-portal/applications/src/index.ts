import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

import { m } from './lib/messages'

export const applicationsMessages = m

export const applicationsModule: ServicePortalModule = {
  name: m.name,
  widgets: () => [],
  routes: async () => {
    const applicationRoutes = [
      {
        name: m.name,
        path: ServicePortalPath.ApplicationRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}
