import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  widgets: () => [],
  routes: () => [
    {
      name: 'Mínar upplýsingar',
      path: ServicePortalPath.MyInfoRoot,
      render: () =>
        lazy(() => import('./screens/UserInfoOverview/UserInfoOverview')),
    },
    {
      name: m.userInfo,
      path: ServicePortalPath.UserInfo,
      render: () => lazy(() => import('./screens/UserInfo/UserInfo')),
    },
    {
      name: m.family,
      path: ServicePortalPath.FamilyRoot,
      render: () =>
        lazy(() => import('./screens/FamilyOverview/FamilyOverview')),
    },
    {
      name: 'Family Member',
      path: ServicePortalPath.FamilyMember,
      render: () => lazy(() => import('./screens/FamilyMember/FamilyMember')),
    },
  ],
}

export * from './components/FamilyMemberCard/FamilyMemberCard'
