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
      name: m.educationFramhskoli,
      path: EducationPaths.EducationFramhskoli,
      children: [
        {
          name: m.educationFramhskoliCareer,
          breadcrumbHide: true,
          path: EducationPaths.EducationFramhskoliCareer,
        },
        {
          // TODO: Move this.
          name: m.educationFramhskoliGraduation,
          breadcrumbHide: true,
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
  ],
}
