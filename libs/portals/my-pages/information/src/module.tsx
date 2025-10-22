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

const CompanySettings = lazy(() =>
  import('./screens/CompanySettings/CompanySettings'),
)

// const CompanyNotificationsSettings = lazy(() =>
//   import('./screens/CompanyNotifications/CompanyNotifications'),
// )
const UserNotificationsSettings = lazy(() =>
  import('./screens/UserNotifications/UserNotifications'),
)

export const informationModule: PortalModule = {
  name: 'Upplýsingar',
  routes: async (routesProps) => {
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

    const isCompany =
      routesProps.userInfo.profile?.subjectType === 'legalEntity'

    return [
      {
        name: m.userInfo,
        path: InformationPaths.MyInfoRoot,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <Navigate to={InformationPaths.MyInfoRootOverview} replace />,
      },
      {
        name: m.myInfo,
        path: InformationPaths.MyInfoRootOverview,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <UserInfoOverview />,
      },
      {
        name: m.userInfo,
        path: InformationPaths.UserInfo,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <UserInfo />,
      },
      {
        name: m.familyChild,
        path: InformationPaths.BioChild,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <FamilyMemberBioChild />,
      },
      {
        name: m.familyChild,
        path: InformationPaths.ChildCustody,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <FamilyMemberChildCustody />,
      },
      {
        name: m.familySpouse,
        path: InformationPaths.Spouse,
        enabled: scopes.includes(ApiScope.meDetails) && !isCompany,
        element: <Spouse />,
      },
      {
        name: m.mySettings,
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
        name: m.notifications,
        path: InformationPaths.Notifications,
        enabled: scopes.includes(DocumentsScope.main),
        element: <Notifications />,
      },
    ]
  },
  companyRoutes: async (routesProps) => {
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
        name: m.companyTitle,
        path: InformationPaths.Company,
        enabled: scopes.includes(ApiScope.company),
        element: <CompanyInfo />,
      },
      {
        name: m.companySettings,
        path: InformationPaths.CompanySettings,
        enabled: scopes.includes(ApiScope.company) && isSettingsEnabled,
        element: <CompanySettings />,
      },
      {
        name: m.notifications,
        path: InformationPaths.CompanyNotifications,
        enabled: scopes.includes(ApiScope.company) && isSettingsEnabled,
        element: <Notifications />,
      },
    ]
  },
}
