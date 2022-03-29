import { Query } from '@island.is/api/schema'
import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import { GET_TAPS_QUERY } from '@island.is/service-portal/graphql'
import * as Sentry from '@sentry/react'
import { lazy } from 'react'

const tabRoutes = {
  transactions: {
    name: m.financeTransactions,
    path: ServicePortalPath.FinanceTransactions,
    render: () => lazy(() => import('./screens/FinanceTransactions')),
    navHide: true,
  },
  employeeClaims: {
    name: m.financeEmployeeClaims,
    path: ServicePortalPath.FinanceEmployeeClaims,
    render: () => lazy(() => import('./screens/FinanceEmployeeClaims')),
    navHide: true,
  },
  localTax: {
    name: m.financeLocalTax,
    path: ServicePortalPath.FinanceLocalTax,
    render: () => lazy(() => import('./screens/FinanceLocalTax')),
    navHide: true,
  },
}

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.finance,
        path: ServicePortalPath.FinanceRoot,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
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
        name: m.financeSchedule,
        path: ServicePortalPath.FinanceSchedule,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceSchedule')),
      },
      {
        ...tabRoutes.transactions,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      },
      {
        ...tabRoutes.employeeClaims,
        enabled: userInfo.scopes.includes(ApiScope.financeSalary),
      },
      {
        ...tabRoutes.localTax,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
      },
    ]
    return routes
  },

  dynamicRoutes: async ({ userInfo, client }) => {
    const routes: ServicePortalRoute[] = []

    try {
      const { data } = await client.query<Query>({
        query: GET_TAPS_QUERY,
      })

      const tabData = data?.getCustomerTapControl
      if (tabData?.RecordsTap) {
        routes.push({
          ...tabRoutes.transactions,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          navHide: false,
        })
      } else {
        routes.push({
          ...tabRoutes.transactions,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          render: () =>
            lazy(() =>
              import('../../core/src/screens/AccessDenied/AccessDenied'),
            ),
        })
      }

      if (tabData?.employeeClaimsTap) {
        routes.push({
          ...tabRoutes.employeeClaims,
          enabled: userInfo.scopes.includes(ApiScope.financeSalary),
          navHide: false,
        })
      } else {
        routes.push({
          ...tabRoutes.employeeClaims,
          enabled: userInfo.scopes.includes(ApiScope.financeSalary),
          render: () =>
            lazy(() =>
              import('../../core/src/screens/AccessDenied/AccessDenied'),
            ),
        })
      }

      if (tabData?.localTaxTap) {
        routes.push({
          ...tabRoutes.localTax,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          navHide: false,
        })
      } else {
        routes.push({
          ...tabRoutes.localTax,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          render: () =>
            lazy(() =>
              import('../../core/src/screens/AccessDenied/AccessDenied'),
            ),
        })
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
