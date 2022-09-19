import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.finance,
        path: ServicePortalPath.FinanceRoot,
        enabled: [
          ApiScope.financeOverview,
          ApiScope.financeSalary,
          ApiScope.financeSchedule,
        ].some((scope) => userInfo.scopes.includes(scope)),
        render: () =>
          lazy(() => import('./screens/FinanceOverview/FinanceOverview')),
      },
      {
        name: m.financeStatus,
        path: ServicePortalPath.FinanceStatus,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceStatus')),
      },
      {
        name: m.financeBills,
        path: ServicePortalPath.FinanceBills,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceBills')),
      },
      {
        name: m.financeTransactions,
        path: ServicePortalPath.FinanceTransactions,
        render: () => lazy(() => import('./screens/FinanceTransactions')),
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        dynamic: true,
      },
      {
        name: m.financeEmployeeClaims,
        path: ServicePortalPath.FinanceEmployeeClaims,
        render: () => lazy(() => import('./screens/FinanceEmployeeClaims')),
        enabled: userInfo.scopes.includes(ApiScope.financeSalary),
        dynamic: true,
      },
      {
        name: m.financeLocalTax,
        path: ServicePortalPath.FinanceLocalTax,
        render: () => lazy(() => import('./screens/FinanceLocalTax')),
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        dynamic: true,
      },
      {
        name: m.financeSchedules,
        path: ServicePortalPath.FinanceSchedule,
        enabled: userInfo.scopes.includes(ApiScope.financeSchedule),
        render: () => lazy(() => import('./screens/FinanceSchedule')),
        dynamic: true,
      },
    ]
    return routes
  },
}
