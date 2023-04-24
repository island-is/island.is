import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { EducationPaths } from './paths'

export const educationNavigation: PortalNavigationItem = {
  name: m.education,
  path: EducationPaths.EducationRoot,
  icon: {
    icon: 'school',
  },
  description: m.educationDescription,
  children: [
    {
      name: m.educationAssessment,
      path: EducationPaths.EducationAssessment,
    },
    {
      name: m.educationGraduation,
      path: EducationPaths.EducationHaskoliGraduation,
    },
  ],
}
