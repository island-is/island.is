import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const licensesModule: ServicePortalModule = {
  name: defineMessage({
    id: 'sp.licenses:nav-title',
    defaultMessage: 'Skírteini',
  }),
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: defineMessage({
        id: 'sp.licenses:main-your-licenses',
        defaultMessage: 'Þín skírteini',
      }),
      path: ServicePortalPath.LicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/LicensesOverview/LicensesOverview')),
    },
    {
      name: defineMessage({
        id: 'sp.licenses:driver-license-title',
        defaultMessage: 'Ökuréttindi',
      }),
      path: ServicePortalPath.LicensesDrivingDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/DrivingLicenseDetail/DrivingLicenseDetail'),
        ),
    },
  ],
}
