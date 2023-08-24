import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from './paths'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: 'Mín starfsleyfi',
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.occupationalLicensesDescription,
  children: [
    {
      name: 'type',
      navHide: true,
      path:
        OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
    },
    {
      name: 'type',
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
    },
  ],
}
