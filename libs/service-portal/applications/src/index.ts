import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

const rootName = defineMessage({
  id: 'sp:applications',
  defaultMessage: 'Umsóknir',
})

export const applicationsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [
    {
      name: rootName,
      weight: 0,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: () => {
    const applicationRoutes = [
      {
        name: rootName,
        path: ServicePortalPath.UmsoknirRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
    ]

    return applicationRoutes
  },
}
