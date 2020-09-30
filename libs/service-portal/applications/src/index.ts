import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  widgets: () => [],
  routes: () => {
    const applicationRoutes = [
      {
        name: 'Umsóknir',
        path: ServicePortalPath.UmsoknirRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}
