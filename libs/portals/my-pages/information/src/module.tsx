import { lazy } from 'react'
import {
  ApiScope,
  hasNotificationScopes,
  UserProfileScope,
} from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule } from '@island.is/portals/core'
import { InformationPaths } from './lib/paths'
import { SignatureCollectionPaths } from '@island.is/portals/my-pages/signature-collection'
import { Navigate } from 'react-router-dom'

const UserInfoOverview = lazy(() =>
  import('./screens/UserInfo/UserInfoOverview/UserInfoOverview'),
)
const UserInfo = lazy(() => import('./screens/UserInfo/UserInfo/UserInfo'))
const FamilyMemberChildCustody = lazy(() =>
  import('./screens/UserInfo/ChildCustody/ChildCustody'),
)
const FamilyMemberBioChild = lazy(() =>
  import('./screens/UserInfo/BioChild/BioChild'),
)
const Spouse = lazy(() => import('./screens/UserInfo/Spouse/Spouse'))
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

const UserContractsOverview = lazy(() =>
  import('./screens/UserContracts/UserContractsOverview/UserContractsOverview'),
)

const UserContract = lazy(() =>
  import('./screens/UserContracts/Contract/UserContract'),
)

const CompanySettings = lazy(() =>
  import('./screens/CompanySettings/CompanySettings'),
)

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  enabled: ({ isCompany: isCompanyUser }) => !isCompanyUser,
  routes: async (routesProps) => {
    const { scopes } = routesProps.userInfo
    const hasUserDetailsAccess = scopes.includes(ApiScope.meDetails)
    const hasNotificationsAccess = hasNotificationScopes(scopes)
    const hasSettingsAccess = hasNotificationScopes(scopes)

    return [
      {
        name: m.userInfo,
        path: InformationPaths.MyInfoRoot,
        enabled: hasUserDetailsAccess,
        element: <Navigate to={InformationPaths.MyInfoRootOverview} replace />,
      },
      {
        name: m.myInfo,
        path: InformationPaths.MyInfoRootOverview,
        enabled: hasUserDetailsAccess,
        element: <UserInfoOverview />,
      },

      {
        name: m.contracts,
        path: InformationPaths.MyContracts,
        enabled: scopes.includes(ApiScope.meDetails),
        element: <UserContractsOverview />,
      },
      {
        name: m.contracts,
        path: InformationPaths.MyContractsDetail,
        enabled: scopes.includes(ApiScope.meDetails),
        element: <UserContract />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.UserInfo,
        enabled: scopes.includes(ApiScope.meDetails),
        element: <UserInfo />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.UserInfo,
        enabled: hasUserDetailsAccess,
        element: <UserInfo />,
      },
      {
        name: m.familyChild,
        path: InformationPaths.BioChild,
        enabled: hasUserDetailsAccess,
        element: <FamilyMemberBioChild />,
      },
      {
        name: m.familyChild,
        path: InformationPaths.ChildCustody,
        enabled: hasUserDetailsAccess,
        element: <FamilyMemberChildCustody />,
      },
      {
        name: m.familySpouse,
        path: InformationPaths.Spouse,
        enabled: hasUserDetailsAccess,
        element: <Spouse />,
      },
      {
        name: m.mySettings,
        path: InformationPaths.Settings,
        enabled: hasSettingsAccess,
        element: <UserProfileSettings />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.SettingsNotifications,
        enabled: hasSettingsAccess,
        element: <UserNotificationsSettings />,
      },
      {
        name: m.notifications,
        path: InformationPaths.Notifications,
        enabled: hasNotificationsAccess,
        element: <Notifications />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.Company,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.MyInfoRoot} replace />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.CompanySettings,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.Settings} replace />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.CompanyNotifications,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.Notifications} replace />,
      },
    ]
  },
}

export const companyInformationModule: PortalModule = {
  name: m.companyTitle,
  enabled: ({ isCompany: isCompanyUser }) => isCompanyUser,
  routes: async (routesProps) => {
    const { scopes } = routesProps.userInfo

    const hasCompanyAccess = scopes.includes(ApiScope.company)
    const hasSettingsAccess = scopes?.includes(UserProfileScope.write)
    const hasNotificationsAccess = hasNotificationScopes(scopes)

    return [
      {
        name: m.companyTitle,
        path: InformationPaths.Company,
        enabled: hasCompanyAccess,
        element: <CompanyInfo />,
      },
      {
        name: m.companySettings,
        path: InformationPaths.CompanySettings,
        enabled: hasSettingsAccess,
        element: <CompanySettings />,
      },
      {
        name: m.notifications,
        path: InformationPaths.CompanyNotifications,
        enabled: hasNotificationsAccess,
        element: <Notifications />,
      },
      {
        name: m.lists,
        path: InformationPaths.CompanyLists,
        enabled: scopes.includes(ApiScope.signatureCollection),
        element: (
          <Navigate
            to={
              SignatureCollectionPaths.CompanySignatureCollectionParliamentaryLists
            }
            replace
          />
        ),
      },
      {
        name: m.companyTitle,
        path: InformationPaths.MyInfoRoot,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.Company} replace />,
      },
      {
        name: m.companyTitle,
        path: InformationPaths.MyInfoRootOverview,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.Company} replace />,
      },
      {
        name: m.companyTitle,
        path: InformationPaths.Settings,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.CompanySettings} replace />,
      },
      {
        name: m.companyTitle,
        path: InformationPaths.SettingsNotifications,
        enabled: true,
        navHide: true,
        element: <Navigate to={InformationPaths.CompanySettings} replace />,
      },
      {
        name: m.companyTitle,
        path: InformationPaths.Notifications,
        enabled: true,
        navHide: true,
        element: (
          <Navigate to={InformationPaths.CompanyNotifications} replace />
        ),
      },
    ]
  },
}
