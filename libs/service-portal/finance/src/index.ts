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
        name: 'Staða',
        path: ServicePortalPath.FinanceStatus,
        render: () => lazy(() => import('./screens/FinanceStatus')),
      },
      {
        name: 'Færslur',
        path: ServicePortalPath.FinanceTransactions,
        render: () => lazy(() => import('./screens/FinanceTransactions')),
      },
      {
        name: 'Laungreiðendakröfur',
        path: ServicePortalPath.FinanceSalary,
        render: () => lazy(() => import('./screens/FinanceSalary')),
      },
    ]

    return routes
  },
}
