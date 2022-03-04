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
    ]
    return routes
  },

  dynamicRoutes: async ({ userInfo, client }) => {
    const routes: ServicePortalRoute[] = []
    try {
      const res = await client.query<Query>({
        query: GET_TAPS_QUERY,
      })

      const data = res?.data?.getCustomerTapControl

      if (data?.RecordsTap) {
        routes.push({
          name: m.financeTransactions,
          path: ServicePortalPath.FinanceTransactions,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          render: () => lazy(() => import('./screens/FinanceTransactions')),
        })
      }

      if (data?.employeeClaimsTap) {
        routes.push({
          name: m.financeEmployeeClaims,
          path: ServicePortalPath.FinanceEmployeeClaims,
          enabled: userInfo.scopes.includes(ApiScope.financeSalary),
          render: () => lazy(() => import('./screens/FinanceEmployeeClaims')),
        })
      }

      if (data?.localTaxTap) {
        routes.push({
          name: m.financeLocalTax,
          path: ServicePortalPath.FinanceLocalTax,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
          render: () => lazy(() => import('./screens/FinanceLocalTax')),
        })
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
