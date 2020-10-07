import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Stillingar',
        path: ServicePortalPath.StillingarRoot,
        render: () => lazy(() => import('./lib/service-portal-settings')),
      },
      {
        name: 'Umboð',
        path: ServicePortalPath.StillingarUmbod,
        render: () =>
          lazy(() => import('./screens/DelegationGreeting/DelegationGreeting')),
      },
      {
        name: 'Skilaboð',
        path: ServicePortalPath.SkilabodRoot,
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
    ]

    return routes
  },
}
