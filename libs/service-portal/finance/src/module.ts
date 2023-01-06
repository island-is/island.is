import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { FinancePaths } from './lib/paths'

export const financeModule: PortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: PortalRoute[] = [
      {
        name: m.finance,
        path: FinancePaths.FinanceRoot,
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
        path: FinancePaths.FinanceStatus,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceStatus')),
      },
      {
        name: m.financeBills,
        path: FinancePaths.FinanceBills,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceBills')),
      },
      {
        name: m.financeTransactions,
        path: FinancePaths.FinanceTransactions,
        render: () => lazy(() => import('./screens/FinanceTransactions')),
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        dynamic: true,
      },
      {
        name: m.financeEmployeeClaims,
        path: FinancePaths.FinanceEmployeeClaims,
        render: () => lazy(() => import('./screens/FinanceEmployeeClaims')),
        enabled: userInfo.scopes.includes(ApiScope.financeSalary),
        dynamic: true,
      },
      {
        name: m.financeLocalTax,
        path: FinancePaths.FinanceLocalTax,
        render: () => lazy(() => import('./screens/FinanceLocalTax')),
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        dynamic: true,
      },
      {
        name: m.financeSchedules,
        path: FinancePaths.FinanceSchedule,
        enabled: userInfo.scopes.includes(ApiScope.financeSchedule),
        render: () => lazy(() => import('./screens/FinanceSchedule')),
        dynamic: true,
      },
    ]
    return routes
  },
}
