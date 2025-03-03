import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPathsV2 } from './lib/paths'
import { Navigate } from 'react-router-dom'

const MyEducation = lazy(() => import('../src/screens/MyEducation/MyEducation'))

export const educationModuleV2: PortalModule = {
  name: 'V2Menntun',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'V2Menntun',
      path: EducationPathsV2.Root,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <Navigate to={EducationPathsV2.MyEducation} replace />,
    },
    {
      name: 'Mín Menntun',
      path: EducationPathsV2.MyEducation,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <MyEducation />,
    },
  ],
}
