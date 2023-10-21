import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const EducationCareer = lazy(() =>
  import('../../education-career/src/screens/EducationCareer/EducationCareer'),
)

const EducationGraduation = lazy(() =>
  import('./screens/EducationGraduation/EducationGraduation'),
)

const EducationGraduationDetail = lazy(() =>
  import('./screens/EducationGraduationDetail/EducationGraduationDetail'),
)

const SecondarySchoolCareer = lazy(() =>
  import('./screens/SecondarySchoolCareer/SecondarySchoolCareer'),
)

const SecondarySchoolGraduationOverview = lazy(() =>
  import(
    './screens/SecondarySchoolGraduationOverview/SecondarySchoolGraduationOverview'
  ),
)

const SecondarySchoolGraduationSingle = lazy(() =>
  import(
    './screens/SecondarySchoolGraduationSingle/SecondarySchoolGraduationSingle'
  ),
)

const SecondarySchoolGraduationDetail = lazy(() =>
  import(
    './screens/SecondarySchoolGraduationDetail/SecondarySchoolGraduationDetail'
  ),
)

const DrivingLessonsBook = lazy(() =>
  import('./screens/DrivingLessonsBook/DrivingLessonsBook'),
)

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
      enabled:
        userInfo.scopes.includes(ApiScope.education) ||
        userInfo.scopes.includes(ApiScope.vehicles),
      element: <Navigate to={EducationPaths.EducationAssessment} replace />,
    },

    // Grunnskóli - Elementary
    {
      name: 'Grunnskóli',
      path: EducationPaths.EducationGrunnskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPaths.EducationAssessment} replace />,
    },
    {
      name: 'Námsmat',
      path: EducationPaths.EducationAssessment,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationCareer />,
    },

    // Framhaldsskóli - Secondary education
    {
      name: 'Framhaldsskóli',
      path: EducationPaths.EducationFramhskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      key: 'SecondaryEducation',
      element: (
        <Navigate to={EducationPaths.EducationFramhskoliCareer} replace />
      ),
    },
    {
      name: 'Framhaldsskóli - Námsferill',
      path: EducationPaths.EducationFramhskoliCareer,
      enabled: userInfo.scopes.includes(ApiScope.education),
      key: 'SecondaryEducation',
      element: <SecondarySchoolCareer />,
    },
    {
      name: 'Útskriftaryfirlit',
      path: EducationPaths.EducationFramhskoliGraduationOverview,
      key: 'SecondaryEducation',
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolGraduationOverview />,
    },
    {
      name: 'Útskriftarferill',
      path: EducationPaths.EducationFramhskoliGraduationSingle,
      key: 'SecondaryEducation',
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolGraduationSingle />,
    },
    {
      name: 'Útskriftarferill nánar',
      path: EducationPaths.EducationFramhskoliGraduationDetail,
      key: 'SecondaryEducation',
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolGraduationDetail />,
    },

    // Haskoli - Univeristy
    {
      name: 'Háskóli',
      path: EducationPaths.EducationHaskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: (
        <Navigate to={EducationPaths.EducationHaskoliGraduation} replace />
      ),
    },
    {
      name: 'Brautskráning',
      path: EducationPaths.EducationHaskoliGraduation,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationGraduation />,
    },
    {
      name: 'Brautskráning - nánar ',
      path: EducationPaths.EducationHaskoliGraduationDetail,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationGraduationDetail />,
    },

    // Driving lessons
    {
      name: 'Ökunám',
      path: EducationPaths.EducationDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      element: <DrivingLessonsBook />,
    },
  ],
}
