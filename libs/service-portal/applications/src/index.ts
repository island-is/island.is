import { lazy } from 'react'

import { ApplicationScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { m } from './lib/messages'

export const applicationsModule: ServicePortalModule = {
  name: m.heading,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.heading,
      path: ServicePortalPath.ApplicationRoot,
      enabled: userInfo?.scopes?.includes(ApplicationScope.read),
      render: () =>
        lazy(() => import('./screens/ApplicationList/ApplicationList')),
    },
  ],
}
