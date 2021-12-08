import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const licensesModule: ServicePortalModule = {
  name: 'Skilríki',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Skilríki',
      path: ServicePortalPath.LicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/Licenses')),
    },
  ],
}
