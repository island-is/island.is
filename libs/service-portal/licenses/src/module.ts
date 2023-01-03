import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { LicensePaths } from './lib/paths'
import { defineMessage } from 'react-intl'

export const licenseModule: PortalModule = {
  name: m.licenseNavTitle,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: defineMessage({
        id: 'sp.license:main-your-licenses',
        defaultMessage: 'Þín skírteini',
      }),
      path: LicensePaths.LicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicensesOverview')),
    },
    {
      name: 'Skírteini',
      path: LicensePaths.LicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () => lazy(() => import('./screens/LicenseDetail/LicenseDetail')),
    },
    {
      name: m.passport,
      path: LicensePaths.LicensesPassportDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      render: () =>
        lazy(() => import('./screens/PassportDetail/PassportDetail')),
    },
  ],
}
