import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Fjármál',
        path: ServicePortalPath.FinanceRoot,
        render: () =>
          lazy(() => import('./screens/FinanceOverview/FinanceOverview')),
      },
      {
        name: "Staða",
        path: ServicePortalPath.FinanceStatus,
        render: () =>
          lazy(() =>
            import('./screens/FinanceStatus'),
          ),
      },
    ]

    return routes
  },
}
