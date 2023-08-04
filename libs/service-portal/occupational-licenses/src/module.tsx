import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { lazy } from 'react'

const OccupationalLicensesOverview = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

export const occupationalLicensesModule: PortalModule = {
  name: 'Starfsleyfi',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Starfsleyfi',
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: true,
      element: <OccupationalLicensesOverview />,
    },
  ],
}
