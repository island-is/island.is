import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { OccupationalLicensesPaths } from './paths'
import { olMessage as om } from './messages'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: om.occupationalLicense,
  description: m.occupationalLicensesNavIntro,
  intro: m.occupationalLicensesDescription,
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
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
