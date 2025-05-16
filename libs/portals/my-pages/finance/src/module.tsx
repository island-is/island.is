import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule } from '@island.is/portals/core'
import { FinancePaths } from './lib/paths'
import { Navigate } from 'react-router-dom'
import {
  financeDomainLoader,
  financeRoutesLoader,
} from './screens/FinanceRoutes.loader'
import { redirects } from './financeRedirects'
import FinanceTransactionsVehicleMileage from './screens/FinanceTransactionsVehicleMileage'

const FinanceStatus = lazy(() => import('./screens/FinanceStatus'))
const FinanceBills = lazy(() => import('./screens/FinanceBills'))
const FinanceTransactionsCategories = lazy(() =>
  import('./screens/FinanceTransactions'),
)
const FinanceTransactionPeriods = lazy(() =>
  import('./screens/FinanceTransactionPeriods'),
)
const FinanceEmployeeClaims = lazy(() =>
  import('./screens/FinanceEmployeeClaims'),
)
const FinanceLocalTax = lazy(() => import('./screens/FinanceLocalTax'))
const FinanceSchedule = lazy(() => import('./screens/FinanceSchedule'))
const FinanceLoans = lazy(() => import('./screens/FinanceLoans'))
const FinanceHousingBenefits = lazy(() => import('./screens/HousingBenefits'))

export const financeModule: PortalModule = {
  name: 'Fjármál',
  layout: 'full',
  routes: ({ userInfo, ...rest }) => [
    {
      name: m.finance,
      path: FinancePaths.FinanceRoot,
      enabled: [
        ApiScope.financeOverview,
        ApiScope.financeSalary,
        ApiScope.financeSchedule,
      ].some((scope) => userInfo.scopes.includes(scope)),
      element: <Navigate to={FinancePaths.FinanceStatus} replace />,
    },
    {
      name: m.financeStatus,
      path: FinancePaths.FinanceStatus,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceStatus />,
      loader: financeDomainLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeBills,
      path: FinancePaths.FinancePaymentsBills,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceBills />,
      loader: financeDomainLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeTransactionsCategories,
      path: FinancePaths.FinanceTransactionCategories,
      element: <FinanceTransactionsCategories />,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeTransactionsVehiclesMileage,
      path: FinancePaths.FinanceTransactionVehicleMileage,
      element: <FinanceTransactionsVehicleMileage />,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeTransactionPeriods,
      path: FinancePaths.FinanceTransactionPeriods,
      element: <FinanceTransactionPeriods />,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
      key: 'FinanceTransactionPeriods',
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
      path: FinancePaths.FinancePaymentsSchedule, //
      enabled: userInfo.scopes.includes(ApiScope.financeSchedule),
      element: <FinanceSchedule />,
      dynamic: true,
      loader: financeRoutesLoader({ userInfo, ...rest }),
    },
    {
      name: m.financeHousingBenefits,
      path: FinancePaths.FinancePaymentsHousingBenefits,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceHousingBenefits />,
    },
    {
      name: m.financeLoans,
      path: FinancePaths.FinanceLoans,
      enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      element: <FinanceLoans />,
    },
    ...redirects,
  ],
}
