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
      name: m.drivingLicense,
      path: ServicePortalPath.LicensesDrivingDetail,

      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/DrivingLicenseDetail/DrivingLicenseDetail'),
        ),
    },
    {
      name: m.adrLicense,
      path: ServicePortalPath.LicensesAdrDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/AdrLicenseDetail/AdrLicenseDetail')),
    },
    {
      name: m.machineLicense,
      path: ServicePortalPath.LicensesMachineDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() =>
          import('./screens/MachineLicenseDetail/MachineLicenseDetail'),
        ),
    },
  ],
}
