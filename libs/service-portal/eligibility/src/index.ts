import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const eligibilityModule: ServicePortalModule = {
  name: 'Mín réttindi',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.eligibility,
      path: ServicePortalPath.MyLicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/Eligibility')),
    },
  ],
}
