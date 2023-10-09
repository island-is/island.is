import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { FinancePaths } from './lib/paths'
import { financeRoutesLoader } from './screens/FinanceRoutes.loader'

const FinanceOverview = lazy(() =>
  import('./screens/FinanceOverview/FinanceOverview'),
)
const FinanceStatus = lazy(() => import('./screens/FinanceStatus'))
const FinanceBills = lazy(() => import('./screens/FinanceBills'))
const FinanceTransactions = lazy(() => import('./screens/FinanceTransactions'))
const FinanceEmployeeClaims = lazy(() =>
  import('./screens/FinanceEmployeeClaims'),
)
const FinanceLocalTax = lazy(() => import('./screens/FinanceLocalTax'))
const FinanceSchedule = lazy(() => import('./screens/FinanceSchedule'))

export const financeModule: PortalModule = {
  name: 'Fjármál',
  routes: ({ userInfo, ...rest }) => [
    {
      name: m.finance,
      path: FinancePaths.FinanceRoot,
      enabled: [
        ApiScope.financeOverview,
        ApiScope.financeSalary,
        ApiScope.financeSchedule,
      ].some((scope) => userInfo.scopes.includes(scope)),
      element: <FinanceOverview />,
    },
    {
      name: m.financeStatus,
      path: FinancePaths.FinanceStatus,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceStatus />,
    },
    {
      name: m.financeBills,
      path: FinancePaths.FinanceBills,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceBills />,
    },
    {
      name: m.financeTransactions,
      path: FinancePaths.FinanceTransactions,
      element: <FinanceTransactions />,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeEmployeeClaims,
      path: FinancePaths.FinanceEmployeeClaims,
      element: <FinanceEmployeeClaims />,
      enabled: userInfo.scopes.includes(ApiScope.financeSalary),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeLocalTax,
      path: FinancePaths.FinanceLocalTax,
      element: <FinanceLocalTax />,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeSchedules,
      path: FinancePaths.FinanceSchedule,
      enabled: userInfo.scopes.includes(ApiScope.financeSchedule),
      element: <FinanceSchedule />,
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
  ],
}
