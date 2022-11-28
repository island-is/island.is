import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

export const licensesModule: ServicePortalModule = {
  name: m.licenseNavTitle,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: defineMessage({
        id: 'sp.license:main-your-licenses',
        defaultMessage: 'Þín skírteini',
      }),
      path: ServicePortalPath.LicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicensesOverview')),
    },
    {
      name: 'Skírteini',
      path: ServicePortalPath.LicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
    {
      name: m.passport,
      path: ServicePortalPath.LicensesPassportDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/PassportDetail/PassportDetail')),
    },
  ],
}
