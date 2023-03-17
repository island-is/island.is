import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'

const EducationOverview = lazy(() =>
  import('./screens/EducationOverview/EducationOverview'),
)

const EducationCareer = lazy(() =>
  import('../../education-career/src/screens/EducationCareer/EducationCareer'),
)

const EducationGraduation = lazy(() =>
  import('./screens/EducationGraduation/EducationGraduation'),
)

const EducationGraduationDetail = lazy(() =>
  import('./screens/EducationGraduationDetail/EducationGraduationDetail'),
)

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationOverview />,
    },
    {
      name: 'Námsmat',
      path: EducationPaths.EducationAssessment,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationCareer />,
    },
    // {
    //   name: 'Framhaldsskóli',
    //   path: EducationPaths.EducationRoot,
    //   enabled: userInfo.scopes.includes(ApiScope.education),
    //   render: () =>
    //     lazy(() =>
    //       import(
    //         '../../education-career/src/screens/EducationCareer/EducationCareer'
    //       ),
    //     ),
    // },
    {
      name: 'Brautskráning',
      path: EducationPaths.EducationHaskoliGraduation,
      enabled: userInfo.scopes.includes(ApiScope.education),
      dynamic: true, // dynamic to check feature flag
      element: <EducationGraduation />,
    },
    {
      name: 'Brautskráning - nánar ',
      path: EducationPaths.EducationHaskoliGraduationDetail,
      enabled: userInfo.scopes.includes(ApiScope.education),
      dynamic: true, // dynamic to check feature flag
      element: <EducationGraduationDetail />,
    },
  ],
}
