import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { OccupationalLicensesPaths } from './paths'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: m.occupationalLicenses,
  description: m.occupationalLicensesNavIntro,
  intro: m.occupationalLicensesDescription,
  searchTags: [
    s.occupationalLicensesRights,
    s.occupationalLicensesJobRights,
    s.occupationalLicensesCertificate,
    s.occupationalLicensesSpecialLicense,
  ],
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
  children: [
    {
      name: m.myOccupationalLicenses,
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
    {
      name: m.sailorsSectionTitle,
      path: OccupationalLicensesPaths.SailorsRoot,
      children: [
        {
          name: m.sailorsSchoolCertificatesTitle,
          path: OccupationalLicensesPaths.SailorsSchoolCertificates,
        },
        {
          name: m.sailorsRightCertificatesTitle,
          path: OccupationalLicensesPaths.SailorsRightCertificates,
        },
        {
          name: m.sailorsCrewRegistrationsTitle,
          path: OccupationalLicensesPaths.SailorsCrewRegistrations,
        },
      ],
    },
  ],
}
