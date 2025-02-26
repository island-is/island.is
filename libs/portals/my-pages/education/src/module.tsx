import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const Overview = lazy(() => import('./screens/v2/Overview/Overview'))
const PrimarySchoolFamilyExamOverview = lazy(
  () =>
    import(
      './screens/v1/PrimarySchoolFamilyExamOverview/PrimarySchoolFamilyExamOverview'
    ),
)

const PrimarySchoolExamDetail = lazy(
  () =>
    import(
      './screens/v1/PrimarySchoolFamilyExamDetail/PrimarySchoolFamilyExamDetail'
    ),
)

const EducationGraduation = lazy(
  () => import('./screens/v1/EducationGraduation/EducationGraduation'),
)

const EducationGraduationDetail = lazy(
  () =>
    import('./screens/v1/EducationGraduationDetail/EducationGraduationDetail'),
)

const SecondarySchoolCareer = lazy(
  () => import('./screens/v1/SecondarySchoolCareer/SecondarySchoolCareer'),
)

const SecondarySchoolGraduationOverview = lazy(
  () =>
    import(
      './screens/v1/SecondarySchoolGraduationOverview/SecondarySchoolGraduationOverview'
    ),
)

const SecondarySchoolGraduationSingle = lazy(
  () =>
    import(
      './screens/v1/SecondarySchoolGraduationSingle/SecondarySchoolGraduationSingle'
    ),
)

const SecondarySchoolGraduationDetail = lazy(
  () =>
    import(
      './screens/v1/SecondarySchoolGraduationDetail/SecondarySchoolGraduationDetail'
    ),
)

const DrivingLessonsBook = lazy(
  () => import('./screens/v1/DrivingLessonsBook/DrivingLessonsBook'),
)

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPaths.EducationOverview} replace />,
    },
    {
      name: 'Mín menntun',
      path: EducationPaths.EducationOverview,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Overview />,
    },

    // Grunnskóli - Elementary
    {
      name: 'Grunnskóli',
      path: EducationPaths.EducationGrunnskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: (
        <Navigate
          to={EducationPaths.EducationPrimarySchoolAssessment}
          replace
        />
      ),
    },
    {
      name: 'Námsmat',
      path: EducationPaths.EducationPrimarySchoolAssessment,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolFamilyExamOverview />,
    },
    {
      name: 'Námsmat nánar',
      path: EducationPaths.EducationPrimarySchoolAssessmentDetail,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolExamDetail />,
    },

    // Framhaldsskóli - Secondary education
    {
      name: 'Framhaldsskóli',
      path: EducationPaths.EducationFramhskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: (
        <Navigate to={EducationPaths.EducationFramhskoliCareer} replace />
      ),
    },
    {
      name: 'Framhaldsskóli - Námsferill',
      path: EducationPaths.EducationFramhskoliCareer,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolCareer />,
    },
    {
      name: 'Útskriftaryfirlit',
      path: EducationPaths.EducationFramhskoliGraduationOverview,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolGraduationOverview />,
    },
    {
      name: 'Útskriftarferill',
      path: EducationPaths.EducationFramhskoliGraduationSingle,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <SecondarySchoolGraduationSingle />,
    },
    {
      name: 'Útskriftarferill nánar',
      path: EducationPaths.EducationFramhskoliGraduationDetail,
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
      enabled: userInfo.scopes.includes(ApiScope.education),
      dynamic: true,
      element: <DrivingLessonsBook />,
    },
  ],
}
