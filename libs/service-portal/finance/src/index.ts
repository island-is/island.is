import { Query } from '@island.is/api/schema'
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
  routes: () => {
    const routes: ServicePortalRoute[] = [
      // {
      //   name: m.finance,
      //   path: ServicePortalPath.FinanceRoot,
      //   render: () =>
      //     lazy(() => import('./screens/FinanceOverview/FinanceOverview')),
      // },
      {
        name: m.financeStatus,
        path: ServicePortalPath.FinanceStatus,
        render: () => lazy(() => import('./screens/FinanceStatus')),
      },
      {
        name: m.financeBills,
        path: ServicePortalPath.FinanceBills,
        render: () => lazy(() => import('./screens/FinanceBills')),
      },
    ]
    return routes
  },

  dynamicRoutes: async ({ client }) => {
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
          render: () => lazy(() => import('./screens/FinanceTransactions')),
        })
      }

      if (data?.employeeClaimsTap) {
        routes.push({
          name: m.financeEmployeeClaims,
          path: ServicePortalPath.FinanceEmployeeClaims,
          render: () => lazy(() => import('./screens/FinanceEmployeeClaims')),
        })
      }

      if (data?.localTaxTap) {
        routes.push({
          name: m.financeLocalTax,
          path: ServicePortalPath.FinanceLocalTax,
          render: () => lazy(() => import('./screens/FinanceLocalTax')),
        })
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
