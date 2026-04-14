import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { EducationPaths } from './paths'
import { primarySchoolMessages as psm } from './messages'

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
      // Old assessment screen — hidden from nav and breadcrumb; kept as sibling
      // (not under Grunnskoli) so that when the primary-school feature flag is
      // off and the EducationGrunnskoli route is filtered out, the Grunnskoli
      // nav item has no descendant routes and is removed from the tree entirely.
      name: m.educationAssessment,
      navHide: true,
      breadcrumbHide: true,
      searchHide: true,
      path: EducationPaths.EducationAssessment,
    },
    {
      name: m.educationGrunnskoli,
      description: m.educationPrimarySchoolIntro,
      searchTags: [m.educationAssessment],
      path: EducationPaths.EducationGrunnskoli,
      // No subnav in sidebar for grunnskóli
      children: [
        {
          // Student list — same content as grunnskoli root via wrapper, hide from both
          name: m.educationGrunnskoli,
          navHide: true,
          breadcrumbHide: true,
          searchHide: true,
          path: EducationPaths.PrimarySchoolList,
          children: [
            {
              // Student hub — "Nemandi" in breadcrumb
              name: psm.studentLabel,
              navHide: true,
              searchHide: true,
              path: EducationPaths.PrimarySchoolStudent,
              children: [
                {
                  name: m.overview,
                  navHide: true,
                  searchHide: true,
                  path: EducationPaths.PrimarySchoolOverview,
                },
                {
                  name: psm.assessmentTitle,
                  navHide: true,
                  searchHide: true,
                  path: EducationPaths.PrimarySchoolAssessment,
                },
              ],
            },
          ],
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
