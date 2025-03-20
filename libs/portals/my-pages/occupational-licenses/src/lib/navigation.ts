import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { OccupationalLicensesPaths } from './paths'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: m.occupationalLicenses,
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.occupationalLicensesNavIntro,
  children: [
    {
      name: m.myEducationLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
    },
    {
      name: m.detailInfo,
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesDetail,
    },
    {
      name: 'type',
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
    },
    {
      name: 'type',
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
    },
  ],
}
