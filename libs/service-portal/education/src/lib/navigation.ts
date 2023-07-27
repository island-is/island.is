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
      children: [
        {
          name: m.overview,
          navHide: true,
          path: EducationPaths.EducationHaskoliGraduationDetail,
        },
      ],
    },
    {
      name: m.educationFramhskoliCareer,
      breadcrumbHide: false,
      path: EducationPaths.EducationFramhskoliCareer,
    },
    {
      name: m.educationFramhskoliGraduation,
      breadcrumbHide: false,
      path: EducationPaths.EducationFramhskoliGraduationOverview,
      children: [
        {
          name: m.educationFramhskoliGraduation,
          breadcrumbHide: true,
          path: EducationPaths.EducationFramhskoliGraduationSingle,
        },
        {
          name: m.educationFramhskoliGraduation,
          breadcrumbHide: true,
          path: EducationPaths.EducationFramhskoliGraduationDetail,
        },
      ],
    },
  ],
}
