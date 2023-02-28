import { lazy } from 'react'
import { UserProfileScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PersonalInformationPaths } from './lib/paths'

const UserProfile = lazy(() => import('./screens/UserProfile/UserProfile'))
const Messages = lazy(() => import('./screens/Messages/Messages'))
const SettingsRoot = lazy(() => import('./screens/SettingsRoot/SettingsRoot'))

export const personalInformationModule: PortalModule = {
  name: 'Persónuupplýsingar',
  routes: ({ userInfo }) => [
    {
      name: m.personalInformation,
      path: PersonalInformationPaths.SettingsPersonalInformation,
      enabled: userInfo.scopes.includes(UserProfileScope.write),
      element: <UserProfile />,
    },
    {
      name: m.messages,
      path: PersonalInformationPaths.MessagesRoot,
      enabled: userInfo.scopes.includes(UserProfileScope.write),
      element: <Messages />,
    },
    {
      name: 'Stillingar',
      path: PersonalInformationPaths.SettingsRoot,
      enabled: userInfo.scopes.includes(UserProfileScope.write),
      element: <SettingsRoot />,
    },
  ],
}
