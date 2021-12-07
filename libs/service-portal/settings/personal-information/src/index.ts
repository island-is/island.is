import { Query } from '@island.is/api/schema'
import { UserProfileScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  ServicePortalGlobalComponent,
  m,
} from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'

import { lazy } from 'react'
import { defineMessage } from 'react-intl'
import * as Sentry from '@sentry/react'

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
        name: defineMessage({
          id: 'sp.settings:edit-phone-number',
          defaultMessage: 'Breyta símanúmeri',
        }),
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () =>
          lazy(() => import('./screens/EditPhoneNumber/EditPhoneNumber')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-email',
          defaultMessage: 'Breyta netfangi',
        }),
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.SettingsPersonalInformationEditEmail,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/EditEmail/EditEmail')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-language',
          defaultMessage: 'Breyta tungumáli',
        }),
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.SettingsPersonalInformationEditLanguage,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/EditLanguage/EditLanguage')),
      },
      {
        name: m.messages,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.MessagesRoot,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-nudge',
          defaultMessage: 'Breyta Hnippi',
        }),
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.SettingsPersonalInformationEditNudge,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/EditNudge/EditNudge')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:email-confirmation',
          defaultMessage: 'Staðfesta netfang',
        }),
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        path: ServicePortalPath.SettingsPersonalInformationEmailConfirmation,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () =>
          lazy(() => import('./screens/EmailConfirmation/EmailConfirmation')),
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

      // If the user profile is empty, we render the onboarding modal
      if (
        process.env.NODE_ENV !== 'development' &&
        res.data?.getUserProfile === null &&
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
