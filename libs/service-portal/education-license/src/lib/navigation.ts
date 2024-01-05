import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
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
      name: m.myEducationLicense,
      path: EducationLicensePaths.EducationLicense,
    },
  ],
}
