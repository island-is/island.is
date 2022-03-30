import { gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import * as Sentry from '@sentry/react'
import { lazy } from 'react'

const GET_FINANCE_PAYMENT_SCHEDULES = gql`
  query getPaymentSchedulesQuery {
    getPaymentSchedule {
      myPaymentSchedule {
        nationalId
        paymentSchedules {
          approvalDate
          paymentCount
          scheduleName
          scheduleNumber
          scheduleStatus
          scheduleType
          totalAmount
          unpaidAmount
          unpaidCount
          documentID
          downloadServiceURL
        }
      }
    }
  }
`
const tabRoutes = {
  // paymentSchedule: {
  //   name: m.financeSchedule,
  //   path: ServicePortalPath.FinanceSchedule,
  //   //enabled: userInfo.scopes.includes(ApiScope.financeOverview),
  //   render: () => lazy(() => import('./screens/FinanceSchedule')),
  // },
}

export const financeScheduleModule: ServicePortalModule = {
  name: 'Greiðsluáætlun',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.financeSchedules,
        path: ServicePortalPath.FinanceSchedule,
        enabled: userInfo.scopes.includes(ApiScope.financeOverview),
        render: () => lazy(() => import('./screens/FinanceSchedule')),
      },
    ]
    return routes
  },

  // dynamicRoutes: async ({ userInfo, client }) => {
  //   const routes: ServicePortalRoute[] = []

  //   try {
  //     const { data: scheduleData } = await client.query<Query>({
  //       query: GET_FINANCE_PAYMENT_SCHEDULES,
  //     })

  //     const paymentsSchedule =
  //       scheduleData?.getPaymentSchedule?.myPaymentSchedule
  //     if (paymentsSchedule?.paymentSchedules) {
  //       routes.push({
  //         name: m.financeSchedule,
  //         path: ServicePortalPath.FinanceSchedule,
  //         enabled: userInfo.scopes.includes(ApiScope.financeOverview),
  //         render: () => lazy(() => import('./screens/FinanceSchedule')),
  //       })
  //     }
  //   } catch (error) {
  //     Sentry.captureException(error)
  //   }

  //   return routes
  // },
}
