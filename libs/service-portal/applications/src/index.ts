import { lazy } from 'react'

import { ApplicationScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

const OverviewScreen = lazy(() => import('./screens/Overview'))

export const applicationsModule: ServicePortalModule = {
  name: m.applications,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.applications,
      path: ServicePortalPath.ApplicationRoot,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => OverviewScreen,
    },
    {
      name: m.inProgressApplications,
      path: ServicePortalPath.ApplicationInProgressApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => OverviewScreen,
    },
    {
      name: m.unfinishedApplications,
      path: ServicePortalPath.ApplicationIncompleteApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => OverviewScreen,
    },
    {
      name: m.finishedApplications,
      path: ServicePortalPath.ApplicationCompleteApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => OverviewScreen,
    },
  ],
}
