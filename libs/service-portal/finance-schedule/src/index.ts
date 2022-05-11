import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import * as Sentry from '@sentry/react'
import { gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const GET_DEBT_STATUS = gql`
  query FinanceGetDebtStatus {
    getDebtStatus {
      myDebtStatus {
        approvedSchedule
        possibleToSchedule
      }
    }
  }
`

const tabRoutes = {
  schedules: {
    name: m.financeSchedules,
    path: ServicePortalPath.FinanceSchedule,
    render: () => lazy(() => import('./screens/FinanceSchedule')),
    navHide: true,
  },
}

export const financeScheduleModule: ServicePortalModule = {
  name: 'Greiðsluáætlun',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = []
    return routes
  },
  dynamicRoutes: async ({ userInfo, client }) => {
    const routes: ServicePortalRoute[] = []

    try {
      const { data } = await client.query<Query>({
        query: GET_DEBT_STATUS,
      })

      const debtStatus = data?.getDebtStatus
      if (debtStatus.myDebtStatus) {
        if (
          debtStatus.myDebtStatus[0].approvedSchedule > 0 ||
          debtStatus.myDebtStatus[0].possibleToSchedule > 0
        ) {
          routes.push({
            ...tabRoutes.schedules,
            enabled: userInfo.scopes.includes(ApiScope.financeOverview),
            navHide: false,
          })
        }
      } else {
        routes.push({
          ...tabRoutes.schedules,
          enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        })
      }
    } catch (error) {
      Sentry.captureException(error)
    }
    return routes
  },
}
