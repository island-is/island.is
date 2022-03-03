import { lazy } from 'react'
import * as Sentry from '@sentry/react'
import differenceInMonths from 'date-fns/differenceInMonths'

import { Query } from '@island.is/api/schema'
import { UserProfileScope } from '@island.is/auth/scopes'
import {
  m,
  ServicePortalGlobalComponent,
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'

import { outOfDate } from '../src/utils/outOfDate'

export const personalInformationModule: ServicePortalModule = {
  name: 'Persónuupplýsingar',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.personalInformation,
        path: ServicePortalPath.SettingsPersonalInformation,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/UserProfile/UserProfile')),
      },
      {
        name: m.messages,
        path: ServicePortalPath.MessagesRoot,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
    ]

    return routes
  },
  global: async ({ client, userInfo }) => {
    const routes: ServicePortalGlobalComponent[] = []

    /**
     * User Profile Onboarding
     */
    try {
      const res = await client.query<Query>({
        query: USER_PROFILE,
      })

      const profileExists = res.data?.getUserProfile?.modified
      const dateDiffLate = res.data?.getUserProfile
        ? outOfDate(res.data.getUserProfile)
        : false
      // If the user profile is empty or has not been modified for 3 months, we render the onboarding modal
      if (
        // true
        process.env.NODE_ENV !== 'development' &&
        (!profileExists || dateDiffLate) &&
        userInfo.scopes.includes(UserProfileScope.write)
      )
        routes.push({
          render: () =>
            lazy(() =>
              import('./components/UserOnboardingModal/UserOnboardingModal'),
            ),
        })
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
