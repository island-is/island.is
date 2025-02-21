import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const PrimarySchoolFamilyExamOverview = lazy(
  () =>
    import(
      './screens/PrimarySchoolFamilyExamOverview/PrimarySchoolFamilyExamOverview'
    ),
)

const PrimarySchoolExamDetail = lazy(
  () =>
    import(
      './screens/PrimarySchoolFamilyExamDetail/PrimarySchoolFamilyExamDetail'
    ),
)

const EducationGraduation = lazy(
  () => import('./screens/EducationGraduation/EducationGraduation'),
)

const EducationGraduationDetail = lazy(
  () => import('./screens/EducationGraduationDetail/EducationGraduationDetail'),
)

const SecondarySchoolCareer = lazy(
  () => import('./screens/SecondarySchoolCareer/SecondarySchoolCareer'),
)

const SecondarySchoolGraduationOverview = lazy(
  () =>
    import(
      './screens/SecondarySchoolGraduationOverview/SecondarySchoolGraduationOverview'
    ),
)

const SecondarySchoolGraduationSingle = lazy(
  () =>
    import(
      './screens/SecondarySchoolGraduationSingle/SecondarySchoolGraduationSingle'
    ),
)

const SecondarySchoolGraduationDetail = lazy(
  () =>
    import(
      './screens/SecondarySchoolGraduationDetail/SecondarySchoolGraduationDetail'
    ),
)

const DrivingLessonsBook = lazy(
  () => import('./screens/DrivingLessonsBook/DrivingLessonsBook'),
)

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: (
        <Navigate
          to={EducationPaths.EducationPrimarySchoolAssessment}
          replace
        />
      ),
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
