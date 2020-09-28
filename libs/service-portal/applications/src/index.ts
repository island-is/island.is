import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

export const applicationsModule: ServicePortalModule = {
  name: 'Umsóknir',
  widgets: () => [
    {
      name: defineMessage({
        id: 'sp:applications',
        defaultMessage: 'Umsóknir',
      }),
      weight: 0,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: () => {
    const applicationRoutes = [
      {
        name: defineMessage({
          id: 'sp:applications',
          defaultMessage: 'Umsóknir',
        }),
        path: ServicePortalPath.UmsoknirRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}
