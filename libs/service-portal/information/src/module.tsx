import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { InformationPaths } from './lib/paths'

const UserInfoOverview = lazy(() =>
  import('./screens/UserInfoOverview/UserInfoOverview'),
)
const UserInfo = lazy(() => import('./screens/UserInfo/UserInfo'))
const FamilyMember = lazy(() => import('./screens/FamilyMember/FamilyMember'))
const FamilyMemberChild = lazy(() => import('./screens/FamilyMember/Child'))
const Spouse = lazy(() => import('./screens/Spouse/Spouse'))
const CompanyInfo = lazy(() => import('./screens/Company/CompanyInfo'))

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: ({ userInfo }) => [
    {
      name: 'Mínar upplýsingar',
      path: InformationPaths.MyInfoRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <UserInfoOverview />,
    },
    {
      name: m.userInfo,
      path: InformationPaths.UserInfo,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <UserInfo />,
    },
    {
      name: 'Family Member',
      path: InformationPaths.FamilyMember,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <FamilyMember />,
    },
    {
      name: 'Child',
      path: InformationPaths.Child,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <FamilyMemberChild />,
    },
    {
      name: 'Spouse',
      path: InformationPaths.Spouse,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <Spouse />,
    },
  ],
  companyRoutes: ({ userInfo }) => [
    {
      name: 'Um fyrirtæki',
      path: InformationPaths.Company,
      enabled: userInfo.scopes.includes(ApiScope.company),
      element: <CompanyInfo />,
    },
  ],
}
