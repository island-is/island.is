import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { EducationLicensePaths } from './paths'

export const educationLicenseNavigation: PortalNavigationItem = {
  name: m.educationLicense,
  path: EducationLicensePaths.EducationLicense,
  icon: {
    icon: 'receipt',
  },
  description: m.educationLicenseDescription,
  children: [
    {
      name: m.occupationalLicenses,
      path: EducationLicensePaths.EducationLicense,
    },
  ],
}
