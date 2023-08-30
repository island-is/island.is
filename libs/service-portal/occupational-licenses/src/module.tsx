import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { olMessage as ol } from './lib/messages'

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
  name: ol.occupationalLicense,
  enabled: ({ isCompany }) => !isCompany,
  routes: () => [
    {
      name: ol.myLicenses,
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: true,
      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: ol.singleHealthLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
      enabled: true,
      element: <HealthDirectorateDetailScreen />,
    },
    {
      name: ol.singleEducationLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
      enabled: true,
      element: <EducationalDetailScreen />,
    },
  ],
}
