import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  widgets: () => [],
  routes: (userInfo) => {
    const applicationRoutes = [
      {
        name: 'Umsóknir',
        path: ServicePortalPath.UmsoknirRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
      {
        name: 'Umsóknir',
        path: [ServicePortalPath.UmsoknirOpnarUmsoknir],
        render: () => lazy(() => import('./lib/service-portal-applications')),
      },
    ]

    return applicationRoutes
  },
}
