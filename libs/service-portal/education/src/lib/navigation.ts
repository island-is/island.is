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
      // children: [
      //   {
      //     name: m.educationAssessment,
      //     path: EducationPaths.EducationAssessment,
      //   },
      // ],
    },
    // {
    //   name: m.educationFramhskoli,
    //   path: EducationPaths.EducationFramhskoli,
    // }
    {
      name: m.educationGraduation,
      path: EducationPaths.EducationHaskoliGraduation,
      // children: [
      //   {
      //     name: m.educationGraduation,
      //     path: EducationPaths.EducationHaskoliGraduation,
      //   },
      // ],
    },
  ],
}
