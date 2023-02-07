import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { InformationPaths } from './lib/paths'

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: ({ userInfo }) => [
    {
      name: 'Mínar upplýsingar',
      path: InformationPaths.MyInfoRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () =>
        lazy(() => import('./screens/UserInfoOverview/UserInfoOverview')),
    },
    {
      name: m.userInfo,
      path: InformationPaths.UserInfo,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/UserInfo/UserInfo')),
    },
    {
      name: 'Family Member',
      path: InformationPaths.FamilyMember,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/FamilyMember/FamilyMember')),
    },
    {
      name: 'Child',
      path: InformationPaths.Child,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/FamilyMember/Child')),
    },
    {
      name: 'Spouse',
      path: InformationPaths.Spouse,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/Spouse/Spouse')),
    },
  ],
  companyRoutes: ({ userInfo }) => [
    {
      name: 'Um fyrirtæki',
      path: InformationPaths.Company,
      enabled: userInfo.scopes.includes(ApiScope.company),
      render: () => lazy(() => import('./screens/Company/CompanyInfo')),
    },
  ],
}
