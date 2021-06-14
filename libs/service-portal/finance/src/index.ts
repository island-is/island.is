import { Query } from '@island.is/api/schema'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { GET_TAPS_QUERY } from '@island.is/service-portal/graphql'
import * as Sentry from '@sentry/react'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: async ({ client }) => {
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
        name: 'Greiðsluseðlar og Greiðslukvittanir',
        path: ServicePortalPath.FinanceBills,
        render: () => lazy(() => import('./screens/FinanceBills')),
      },
    ]
    try {
      const res = await client.query<Query>({
        query: GET_TAPS_QUERY,
      })

      const data = res?.data?.getCustomerTapControl

      // Show customer records:
      if (data?.RecordsTap) {
        routes.push({
          name: 'Hreyfingar',
          path: ServicePortalPath.FinanceTransactions,
          render: () => lazy(() => import('./screens/FinanceTransactions')),
        })
      }

      // Show employee claims:
      if (data?.employeeClaimsTap) {
        routes.push({
          name: 'Laungreiðendakröfur',
          path: ServicePortalPath.FinanceSalary,
          render: () => lazy(() => import('./screens/FinanceSalary')),
        })
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
