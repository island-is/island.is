import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { olMessage as ol } from './lib/messages'
import { ApiScope } from '@island.is/auth/scopes'

const OccupationalLicensesOverviewScreen = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

const OccupationalLicensesDetailScreen = lazy(() =>
  import('./screens/OccupationalLicensesDetail/OccupationalLicensesDetail'),
)

export const occupationalLicensesModule: PortalModule = {
  name: ol.occupationalLicense,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: ol.myLicenses,
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: ol.singleHealthLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <OccupationalLicensesDetailScreen />,
    },
  ],
}
