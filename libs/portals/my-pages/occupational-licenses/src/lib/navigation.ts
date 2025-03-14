import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { OccupationalLicensesPaths } from './paths'
import { olMessage as om } from './messages'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: om.occupationalLicense,
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  searchHide: true,
  icon: {
    icon: 'receipt',
  },
  description: m.occupationalLicensesNavIntro,
  children: [
    {
      name: om.myLicenses,
      searchHide: true,
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
