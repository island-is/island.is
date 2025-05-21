import { lazy } from 'react'
import {
  ApiScope,
  DocumentsScope,
  UserProfileScope,
} from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule } from '@island.is/portals/core'
import { InformationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const UserInfoOverview = lazy(() =>
  import('./screens/UserInfoOverview/UserInfoOverview'),
)
const UserInfo = lazy(() => import('./screens/UserInfo/UserInfo'))
const FamilyMemberChildCustody = lazy(() =>
  import('./screens/ChildCustody/ChildCustody'),
)
const FamilyMemberBioChild = lazy(() => import('./screens/BioChild/BioChild'))
const Spouse = lazy(() => import('./screens/Spouse/Spouse'))
const CompanyInfo = lazy(() => import('./screens/Company/CompanyInfo'))
const Notifications = lazy(() =>
  import('./screens/Notifications/Notifications'),
)
const UserProfileSettings = lazy(() =>
  import('./screens/UserProfile/UserProfile'),
)
const UserNotificationsSettings = lazy(() =>
  import('./screens/UserNotifications/UserNotifications'),
)

const sharedRoutes = (scopes: string[]) => [
  {
    name: m.mySettings,
    path: InformationPaths.SettingsOld,
    enabled: scopes.includes(UserProfileScope.write),
    element: <Navigate to={InformationPaths.Settings} replace />,
  },
  {
    name: m.mySettings,
    path: InformationPaths.Settings,
    enabled: scopes.includes(UserProfileScope.read),
    element: <UserProfileSettings />,
  },
  {
    name: 'Notifications',
    path: InformationPaths.Notifications,
    enabled: scopes.includes(DocumentsScope.main),
    element: <Notifications />,
  },
]

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: ({ userInfo }) => [
    {
      name: m.userInfo,
      path: InformationPaths.MyInfoRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <Navigate to={InformationPaths.MyInfoRootOverview} replace />,
    },
    {
      name: m.myInfo,
      path: InformationPaths.MyInfoRootOverview,
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
      name: m.familyChild,
      path: InformationPaths.BioChild,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <FamilyMemberBioChild />,
    },
    {
      name: m.familyChild,
      path: InformationPaths.ChildCustody,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <FamilyMemberChildCustody />,
    },
    {
      name: m.userInfo,
      path: InformationPaths.SettingsNotifications,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      key: 'NotificationSettings',
      element: <UserNotificationsSettings />,
    },
    {
      name: m.familySpouse,
      path: InformationPaths.Spouse,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <Spouse />,
    },
    ...sharedRoutes(userInfo.scopes),
  ],
  companyRoutes: ({ userInfo }) => [
    {
      name: m.companyTitle,
      path: InformationPaths.Company,
      enabled: userInfo.scopes.includes(ApiScope.company),
      element: <CompanyInfo />,
    },
    ...sharedRoutes(userInfo.scopes),
  ],
}
