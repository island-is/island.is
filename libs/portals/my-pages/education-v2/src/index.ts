import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const EducationCareer = lazy(
  () =>
    import(
      '../../education-career/src/screens/EducationCareer/EducationCareer'
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
      element: <Navigate to={EducationPaths.EducationAssessment} replace />,
    },
  ],
}
