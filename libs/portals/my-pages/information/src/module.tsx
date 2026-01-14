import { lazy } from 'react'
import {
  ApiScope,
  DocumentsScope,
  UserProfileScope,
} from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import {
  PortalModule,
  PortalModuleRoutesProps,
  PortalRoute,
} from '@island.is/portals/core'
import { InformationPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'
import { Features } from '@island.is/react/feature-flags'
import { parseDelegationTypeFeatureFlagValue } from './utils/parseDelegationTypeFeatureFlagValue'

const UserInfoOverview = lazy(
  () => import('./screens/UserInfo/UserInfoOverview/UserInfoOverview'),
)
const UserInfo = lazy(() => import('./screens/UserInfo/UserInfo/UserInfo'))
const FamilyMemberChildCustody = lazy(
  () => import('./screens/UserInfo/ChildCustody/ChildCustody'),
)
const FamilyMemberBioChild = lazy(
  () => import('./screens/UserInfo/BioChild/BioChild'),
)
const Spouse = lazy(() => import('./screens/UserInfo/Spouse/Spouse'))
const CompanyInfo = lazy(() => import('./screens/Company/CompanyInfo'))
const Notifications = lazy(
  () => import('./screens/Notifications/Notifications'),
)
const UserProfileSettings = lazy(
  () => import('./screens/UserProfile/UserProfile'),
)
const UserNotificationsSettings = lazy(
  () => import('./screens/UserNotifications/UserNotifications'),
)

const UserContractsOverview = lazy(
  () =>
    import(
      './screens/UserContracts/UserContractsOverview/UserContractsOverview'
    ),
)

const UserContract = lazy(
  () => import('./screens/UserContracts/Contract/UserContract'),
)

const sharedRoutes = async (
  routesProps: PortalModuleRoutesProps,
  isCompany = false,
): Promise<PortalRoute[]> => {
  const { scopes, profile } = routesProps.userInfo

  const allowedDelegationTypes = await routesProps.featureFlagClient.getValue(
    Features.delegationTypesWithNotificationsEnabled,
    '',
    { id: profile?.nationalId, attributes: {} },
  )

  const isDelegationTypeFFEnabled = parseDelegationTypeFeatureFlagValue({
    featureFlagValue: allowedDelegationTypes,
    delegationTypes: profile?.delegationType,
    actorNationalId: profile?.nationalId,
  })

  const isSettingsEnabled = isDelegationTypeFFEnabled
    ? scopes.includes(DocumentsScope.main)
    : scopes.includes(UserProfileScope.write)

  return [
    {
      name: isCompany ? m.settings : m.mySettings,
      path: InformationPaths.SettingsOld,
      enabled: isSettingsEnabled,
      element: <Navigate to={InformationPaths.Settings} replace />,
    },
    {
      name: isCompany ? m.settings : m.mySettings,
      path: InformationPaths.Settings,
      enabled: isSettingsEnabled,
      element: <UserProfileSettings />,
    },
    {
      name: m.userInfo,
      path: InformationPaths.SettingsNotifications,
      enabled: isSettingsEnabled,
      element: <UserNotificationsSettings />,
    },
    {
      name: 'Notifications',
      path: InformationPaths.Notifications,
      enabled: scopes.includes(DocumentsScope.main),
      element: <Notifications />,
    },
  ]
}

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: async (routesProps) => {
    const { scopes } = routesProps.userInfo
    return [
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
      ...(await sharedRoutes(routesProps)),
    ]
  },
  companyRoutes: async (routesProps) => {
    const { scopes } = routesProps.userInfo
    return [
      {
        name: m.companyTitle,
        path: InformationPaths.Company,
        enabled: scopes.includes(ApiScope.company),
        element: <CompanyInfo />,
      },
      ...(await sharedRoutes(routesProps, true)),
    ]
  },
}
