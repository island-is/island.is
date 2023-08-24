import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'

const OccupationalLicensesOverviewScreen = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

const EducationalDetailScreen = lazy(() =>
  import('./screens/EducationalDetail/EducationalDetail'),
)

const HealthDirectorateDetailScreen = lazy(() =>
  import('./screens/HealthDirectorateDetail/HealthDirectorateDetail'),
)

export const occupationalLicensesModule: PortalModule = {
  name: 'Starfsleyfi',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Mín starfsleyfi',
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: true,
      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: 'Stakt heilbrigðis starfsleyfi',
      path:
        OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
      enabled: true,
      element: <HealthDirectorateDetailScreen />,
    },
    {
      name: 'Stakt menntunar starfsleyfi',
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
      enabled: true,
      element: <EducationalDetailScreen />,
    },
  ],
}
