import { Query, QueryGetUserProfileArgs } from '@island.is/api/schema'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  ServicePortalGlobalComponent,
} from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Stillingar',
        path: ServicePortalPath.StillingarRoot,
        render: () => lazy(() => import('./lib/service-portal-settings')),
      },
    ]

    return routes
  },
  global: async ({ userInfo, client }) => {
    const routes: ServicePortalGlobalComponent[] = []

    try {
      await client.query<Query, QueryGetUserProfileArgs>({
        query: USER_PROFILE,
        variables: {
          input: {
            nationalId: userInfo.profile.natreg,
          },
        },
      })
      // If successful, there is a user profile present and we
      // don't render the onboarding prompt
    } catch (err) {
      // If there is no user profile present, graphQL returns an error
      // In which case, we render the onboarding modal
      routes.push({
        render: () =>
          lazy(() =>
            import('./components/UserOnboardingModal/UserOnboardingModal'),
          ),
      })
    }
    return routes
  },
}
