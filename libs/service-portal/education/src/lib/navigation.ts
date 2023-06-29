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
      name: m.educationGrunnskoli,
      path: EducationPaths.EducationGrunnskoli,
      children: [
        {
          name: m.educationAssessment,
          path: EducationPaths.EducationAssessment,
        },
      ],
    },
    {
      name: m.educationFramhskoli,
      breadcrumbHide: false,
      path: EducationPaths.EducationFramhskoli,
      children: [
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
              navHide: true,
              path: EducationPaths.EducationFramhskoliGraduationSingle,
            },
            {
              name: m.educationFramhskoliGraduation,
              breadcrumbHide: true,
              navHide: true,
              path: EducationPaths.EducationFramhskoliGraduationDetail,
            },
          ],
        },
      ],
    },
    {
      name: m.educationHaskoli,
      path: EducationPaths.EducationHaskoli,
      breadcrumbHide: false,
      navHide: false,
      children: [
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
    },
    {
      name: m.vehiclesDrivingLessons,
      path: EducationPaths.EducationDrivingLessons,
      navHide: false,
    },
  ],
}
