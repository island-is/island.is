import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

const Eligibility = lazy(() => import('./screens/Eligibility/Eligibility'))

export const eligibilityModule: ServicePortalModule = {
  name: 'Mín réttindi',
  routes: ({ userInfo }) => [
    {
      name: m.eligibility,
      path: ServicePortalPath.MyLicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <Eligibility />,
    },
  ],
}
