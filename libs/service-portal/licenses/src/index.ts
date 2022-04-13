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
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/LicensesOverview/LicensesOverview')),
    },
    {
      name: defineMessage({
        id: 'sp.license:main-children-licenses',
        defaultMessage: 'Skírteini barna',
      }),
      path: ServicePortalPath.LicensesChildrenRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/LicensesOverview/LicensesChildrenOverview'),
        ),
    },
    {
      name: m.drivingLicense,
      path: ServicePortalPath.LicensesDrivingDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/DrivingLicenseDetail/DrivingLicenseDetail'),
        ),
    },
    {
      name: m.passport,
      path: ServicePortalPath.LicensesPassportDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/PassportDetail/PassportDetail')),
    },
    {
      name: m.drivingLicense,
      path: ServicePortalPath.LicensesChildrenDrivingDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/DrivingLicenseDetail/DrivingLicenseDetail'),
        ),
    },
    {
      name: m.passport,
      path: ServicePortalPath.LicensesChildrenPassportDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/PassportDetail/PassportDetail')),
    },
  ],
}
