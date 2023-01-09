import { lazy } from 'react'
import { Query } from '@island.is/api/schema'
import { UserProfileScope } from '@island.is/auth/scopes'
import {
  PortalGlobalComponent,
  PortalModule,
  PortalRoute,
} from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'
import { showModal } from '../src/utils/showModal'
import { PersonalInformationPaths } from './lib/paths'

export const personalInformationModule: PortalModule = {
  name: 'Persónuupplýsingar',
  widgets: () => [],
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
  global: async ({ client, userInfo }) => {
    const routes: PortalGlobalComponent[] = []

    /**
     * User Profile Onboarding
     */
    try {
      const res = await client.query<Query>({
        query: USER_PROFILE,
      })

      const showTheModal = showModal(res.data?.getUserProfile)

      if (
        process.env.NODE_ENV !== 'development' &&
        userInfo.scopes.includes(UserProfileScope.write) &&
        showTheModal
      )
        routes.push({
          render: () =>
            lazy(() =>
              import('./components/UserOnboardingModal/UserOnboardingModal'),
            ),
        })
    } catch (error) {
      console.error(error)
    }

    return routes
  },
}
