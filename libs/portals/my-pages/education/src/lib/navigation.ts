import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { EducationPaths } from './paths'

export const educationNavigation: PortalNavigationItem = {
  name: m.education,
  description: m.educationDescription,
  searchTags: [s.educationDegree, s.educationTest],
  path: EducationPaths.EducationRoot,
  icon: {
    icon: 'school',
  },
  children: [
    {
      name: m.educationGrunnskoli,
      description: m.educationPrimarySchoolIntro,
      searchTags: [m.educationAssessment],
      path: EducationPaths.EducationGrunnskoli,
      children: [
        {
          name: m.educationAssessment,
          searchHide: true,
          path: EducationPaths.EducationAssessment,
        },
      ],
    },
    {
      name: m.educationFramhskoli,
      description: m.educationSecondarySchoolIntro,
      searchTags: [
        m.educationFramhskoliCareer,
        m.educationFramhskoliGraduation,
      ],
      breadcrumbHide: false,
      path: EducationPaths.EducationFramhskoli,
      children: [
        {
          name: m.educationFramhskoliCareer,
          breadcrumbHide: false,
          searchHide: true,
          path: EducationPaths.EducationFramhskoliCareer,
        },
        {
          name: m.educationFramhskoliGraduation,
          searchHide: true,
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
      description: m.educationUniversityIntro,
      searchTags: [m.educationGraduation],
      path: EducationPaths.EducationHaskoli,
      breadcrumbHide: false,
      navHide: false,
      children: [
        {
          name: m.educationGraduation,
          searchHide: true,
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
