import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'

const OccupationalLicensesOverviewScreen = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

const OccupationalLicensesDetailScreen = lazy(() =>
  import('./screens/OccupationalLicenceDetail/OccupationalLicenceDetail'),
)

export const occupationalLicensesModule: PortalModule = {
  name: 'Starfsleyfi',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Starfsleyfi',
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: true,
      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: 'Stakt starfsleyfi',
      path: OccupationalLicensesPaths.OccupationalLicensesDetail,
      enabled: true,
      element: <OccupationalLicensesDetailScreen />,
    },
  ],
}
