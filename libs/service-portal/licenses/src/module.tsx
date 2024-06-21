import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { LicensePaths } from './lib/paths'
import { defineMessage } from 'react-intl'
import { translationLoader } from './screens/Translation.loader'

const LicensesOverviewV2 = lazy(() =>
  import('./screens/LicensesOverview/LicensesOverview'),
)
const LicenseDetail = lazy(() =>
  import('./screens/LicenseDetail/LicenseDetail'),
)
const PassportDetail = lazy(() =>
  import('./screens/PassportDetail/PassportDetail'),
)

export const licensesModule: PortalModule = {
  name: m.licenseNavTitle,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo, ...rest }) => [
    {
      name: defineMessage({
        id: 'sp.license:main-your-licenses',
        defaultMessage: 'Þín skírteini',
      }),
      path: LicensePaths.LicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      loader: translationLoader({ userInfo, ...rest }),
      element: <LicensesOverviewV2 />,
    },
    {
      name: 'Skírteini',
      path: LicensePaths.LicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      element: <LicenseDetail />,
    },
    {
      name: m.passport,
      path: LicensePaths.LicensesPassportDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      element: <PassportDetail />,
    },
  ],
}
