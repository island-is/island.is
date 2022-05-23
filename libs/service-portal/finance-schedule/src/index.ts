import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

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
        dynamic: true,
      },
    ]
    return routes
  },
}
