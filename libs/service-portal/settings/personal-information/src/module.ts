import { lazy } from 'react'
import { UserProfileScope } from '@island.is/auth/scopes'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PersonalInformationPaths } from './lib/paths'

export const personalInformationModule: PortalModule = {
  name: 'Persónuupplýsingar',
  routes: ({ userInfo }) => {
    const routes: PortalRoute[] = [
      {
        name: m.personalInformation,
        path: PersonalInformationPaths.SettingsPersonalInformation,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/UserProfile/UserProfile')),
      },
      {
        name: m.messages,
        path: PersonalInformationPaths.MessagesRoot,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
      {
        name: 'Stillingar',
        path: PersonalInformationPaths.SettingsRoot,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/SettingsRoot/SettingsRoot')),
      },
    ]

    return routes
  },
}
