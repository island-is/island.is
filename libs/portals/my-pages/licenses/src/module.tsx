import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule } from '@island.is/portals/core'
import { LicensePaths } from './lib/paths'
import { defineMessage } from 'react-intl'
import { translationLoader } from './screens/Translation.loader'
import { Navigate } from 'react-router-dom'

const LicensesOverview = lazy(() =>
  import('./screens/LicensesOverview/LicensesOverview'),
)
const LicenseDetail = lazy(() =>
  import('./screens/LicenseDetail/LicenseDetail'),
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
      element: <LicensesOverview />,
    },
    {
      name: 'Skírteini',
      path: LicensePaths.LicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      element: <LicenseDetail />,
    },
    {
      name: 'Skírteini',
      path: LicensePaths.LicensesDetailOld,
      enabled: userInfo.scopes.includes(ApiScope.licenses),
      element: <Navigate to={LicensePaths.LicensesDetail} replace />,
    },
  ],
}
