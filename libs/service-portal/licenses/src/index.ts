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
      render: () =>
        lazy(() => import('./screens/LicensesOverview/LicensesOverview')),
    },
    {
      name: 'Ökuréttindi',
      path: ServicePortalPath.DrivingLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
    {
      name: 'ADR réttindi',
      path: ServicePortalPath.ADRLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
    {
      name: 'Vinnuvélaréttindi',
      path: ServicePortalPath.MachineLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
    {
      name: 'Skotvopnaleyfi',
      path: ServicePortalPath.FirearmLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
  ],
}
