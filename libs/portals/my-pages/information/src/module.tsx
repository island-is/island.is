import { ApiScope, UserProfileScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { InformationPaths } from './lib/paths'
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

const sharedRoutes = (scopes: string[], isCompany = false) => {
  const enabled = scopes.includes(UserProfileScope.read)

  return [
    {
      name: isCompany ? m.settings : m.mySettings,
      path: InformationPaths.SettingsOld,
      enabled,
      element: <Navigate to={InformationPaths.Settings} replace />,
    },
    {
      name: isCompany ? m.settings : m.mySettings,
      path: InformationPaths.Settings,
      enabled,
      element: <UserProfileSettings />,
    },
    {
      name: m.userInfo,
      path: InformationPaths.SettingsNotifications,
      enabled,
      element: <UserNotificationsSettings />,
    },
    {
      name: 'Notifications',
      path: InformationPaths.Notifications,
      enabled,
      element: <Notifications />,
    },
  ]
}

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: ({ userInfo: { scopes } }) => [
    {
      name: m.userInfo,
      path: InformationPaths.MyInfoRoot,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <Navigate to={InformationPaths.MyInfoRootOverview} replace />,
    },
    {
      name: m.myInfo,
      path: InformationPaths.MyInfoRootOverview,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <UserInfoOverview />,
    },
    {
      name: m.userInfo,
      path: InformationPaths.UserInfo,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <UserInfo />,
    },
    {
      name: m.familyChild,
      path: InformationPaths.BioChild,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <FamilyMemberBioChild />,
    },
    {
      name: m.familyChild,
      path: InformationPaths.ChildCustody,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <FamilyMemberChildCustody />,
    },
    {
      name: m.familySpouse,
      path: InformationPaths.Spouse,
      enabled: scopes.includes(ApiScope.meDetails),
      element: <Spouse />,
    },
    ...sharedRoutes(scopes),
  ],
  companyRoutes: ({ userInfo: { scopes } }) => [
    {
      name: m.companyTitle,
      path: InformationPaths.Company,
      enabled: scopes.includes(ApiScope.company),
      element: <CompanyInfo />,
    },
    ...sharedRoutes(scopes, true),
  ],
}
