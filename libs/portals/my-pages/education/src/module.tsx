import { lazy, useEffect, useState } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'

const EducationCareer = lazy(() =>
  import('../../education-career/src/screens/EducationCareer/EducationCareer'),
)

const UniversityGraduation = lazy(() =>
  import('./screens/University/UniversityGraduation/UniversityGraduation'),
)

const UniversityGraduationDetail = lazy(() =>
  import(
    './screens/University/UniversityGraduationDetail/UniversityGraduationDetail'
  ),
)

const SecondarySchoolCareer = lazy(() =>
  import('./screens/SecondarySchool/SecondarySchoolCareer/SecondarySchoolCareer'),
)

const SecondarySchoolGraduationOverview = lazy(() =>
  import(
    './screens/SecondarySchool/SecondarySchoolGraduationOverview/SecondarySchoolGraduationOverview'
  ),
)

const SecondarySchoolGraduationSingle = lazy(() =>
  import(
    './screens/SecondarySchool/SecondarySchoolGraduationSingle/SecondarySchoolGraduationSingle'
  ),
)

const SecondarySchoolGraduationDetail = lazy(() =>
  import(
    './screens/SecondarySchool/SecondarySchoolGraduationDetail/SecondarySchoolGraduationDetail'
  ),
)

const DrivingLessonsBook = lazy(() =>
  import('./screens/DrivingLessons/DrivingLessonsBook/DrivingLessonsBook'),
)

const PrimarySchool = lazy(() =>
  import('./screens/PrimarySchool/PrimarySchool'),
)

const PrimarySchoolStudent = lazy(() =>
  import('./screens/PrimarySchool/PrimarySchoolStudent/PrimarySchoolStudent'),
)

const PrimarySchoolOverview = lazy(() =>
  import('./screens/PrimarySchool/PrimarySchoolOverview/PrimarySchoolOverview'),
)

const PrimarySchoolAssessment = lazy(() =>
  import(
    './screens/PrimarySchool/PrimarySchoolAssessment/PrimarySchoolAssessment'
  ),
)

const PrimarySchoolStudentPermission = lazy(() =>
  import(
    './screens/PrimarySchool/PrimarySchoolStudentPermission/PrimarySchoolStudentPermission'
  ),
)

const PRIMARY_SCHOOL_FLAG = 'PrimarySchool'

const GrunnskoliRoute = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalPrimarySchoolPageEnabled, false)
      .then(setEnabled)
  }, [featureFlagClient])

  if (enabled === null) return null
  if (enabled) return <PrimarySchool />
  return <Navigate to={EducationPaths.EducationAssessment} replace />
}

export const educationModule: PortalModule = {
  name: 'Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPaths.EducationAssessment} replace />,
    },

    // Grunnskóli - Elementary
    {
      name: 'Grunnskóli',
      path: EducationPaths.EducationGrunnskoli,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <GrunnskoliRoute />,
    },
    {
      name: 'Námsmat',
      path: EducationPaths.EducationAssessment,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationCareer />,
    },

    // Primary school (guardian-facing)
    {
      name: 'Nemendur',
      path: EducationPaths.PrimarySchoolList,
      key: PRIMARY_SCHOOL_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchool />,
    },
    {
      name: 'Nemandi',
      path: EducationPaths.PrimarySchoolStudent,
      key: PRIMARY_SCHOOL_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolStudent />,
    },
    {
      name: 'Yfirlit',
      path: EducationPaths.PrimarySchoolOverview,
      key: PRIMARY_SCHOOL_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolOverview />,
    },
    {
      name: 'Námsmat',
      path: EducationPaths.PrimarySchoolAssessment,
      key: PRIMARY_SCHOOL_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolAssessment />,
    },
    {
      name: 'Heimildir',
      path: EducationPaths.PrimarySchoolStudentPermission,
      key: PRIMARY_SCHOOL_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolStudentPermission />,
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
      element: <UniversityGraduation />,
    },
    {
      name: 'Brautskráning - nánar ',
      path: EducationPaths.EducationHaskoliGraduationDetail,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <UniversityGraduationDetail />,
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
