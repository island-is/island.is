import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPathsV2 } from './lib/paths'
import { Navigate } from 'react-router-dom'

const PrimarySchoolOverview = lazy(
  () => import('../src/screens/PrimarySchoolOverview/PrimarySchoolOverview'),
)

export const educationModuleV2: PortalModule = {
  name: 'V2Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'V2Menntun',
      path: EducationPathsV2.Root,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPathsV2.PrimarySchool} replace />,
    },
    {
      name: 'Grunnskóli',
      path: EducationPathsV2.PrimarySchool,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <PrimarySchoolOverview />,
    },
  ],
}
