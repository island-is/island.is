import { Query } from '@island.is/api/schema'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  ServicePortalGlobalComponent,
} from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'
import * as Sentry from '@sentry/react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Stillingar',
        path: ServicePortalPath.SettingsRoot,
        render: () =>
          lazy(() => import('./screens/NavigationScreen/NavigationScreen')),
      },
      {
        name: defineMessage({
          id: 'service.portal:profile-info',
          defaultMessage: 'Minn aðgangur',
        }),
        path: ServicePortalPath.UserProfileRoot,
        render: () => lazy(() => import('./screens/UserProfile/UserProfile')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-phone-number',
          defaultMessage: 'Breyta símanúmeri',
        }),
        path: ServicePortalPath.UserProfileEditPhoneNumber,
        render: () =>
          lazy(() => import('./screens/EditPhoneNumber/EditPhoneNumber')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-email',
          defaultMessage: 'Breyta netfangi',
        }),
        path: ServicePortalPath.UserProfileEditEmail,
        render: () => lazy(() => import('./screens/EditEmail/EditEmail')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-language',
          defaultMessage: 'Breyta tungumáli',
        }),
        path: ServicePortalPath.UserProfileEditLanguage,
        render: () => lazy(() => import('./screens/EditLanguage/EditLanguage')),
      },
      {
        name: defineMessage({
          id: 'service.portal:messages',
          defaultMessage: 'Skilaboð',
        }),
        path: ServicePortalPath.MessagesRoot,
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:email-confirmation',
          defaultMessage: 'Staðfesta netfang',
        }),
        path: ServicePortalPath.UserProfileEmailConfirmation,
        render: () =>
          lazy(() => import('./screens/EmailConfirmation/EmailConfirmation')),
      },
    ]

    return routes
  },
  global: async ({ client }) => {
    const routes: ServicePortalGlobalComponent[] = []

    /**
     * User Profile Onboarding
     */
    try {
      const res = await client.query<Query>({
        query: USER_PROFILE,
      })
      // If the user profile is empty, we render the onboarding modal
      if (res.data?.getUserProfile === null)
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
