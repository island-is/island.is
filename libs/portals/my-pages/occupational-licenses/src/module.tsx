import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'

const EducationalDetailScreen = lazy(() =>
  import('./screens/v1/EducationalDetail/EducationalDetail'),
)

const HealthDirectorateDetailScreen = lazy(() =>
  import('./screens/v1/HealthDirectorateDetail/HealthDirectorateDetail'),
)

const OccupationalLicensesDetailScreen = lazy(() =>
  import('./screens/v2/OccupationalLicensesDetail/OccupationalLicensesDetail'),
)

const OccupationalLicensesOverviewScreen = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

export const occupationalLicensesModule: PortalModule = {
  name: m.occupationalLicenses,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.myOccupationalLicenses,
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: m.singleLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <OccupationalLicensesDetailScreen />,
    },
    {
      name: m.singleHealthLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <HealthDirectorateDetailScreen />,
    },
    {
      name: m.singleEducationLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),

      element: <EducationalDetailScreen />,
    },
  ],
}
