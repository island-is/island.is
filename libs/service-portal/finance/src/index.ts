import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  userHasAccessToScope,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Fjármál',
        path: ServicePortalPath.FjarmalRoot,
        render: () => lazy(() => import('./lib/service-portal-finance')),
      },
    ]

    if (userHasAccessToScope(userInfo, 'vehicles?')) {
      routes.push({
        name: 'Ökutæki',
        path: ServicePortalPath.FjarmalOkutaeki,
      })
    }

    return routes
  },
}
