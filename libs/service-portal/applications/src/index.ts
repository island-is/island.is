import React, { lazy } from 'react'

import { ApplicationScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const applicationsModule: ServicePortalModule = {
  name: m.applications,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.applications,
      path: ServicePortalPath.ApplicationRoot,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => lazy(() => import('./screens/Overview')),
    },
    {
      name: m.unfinishedApplications,
      path: ServicePortalPath.ApplicationUnfinishedApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () =>
        lazy(() => import('./screens/IncompleteApplicationOverview')),
    },
  ],
}
