import { Query } from '@island.is/api/schema'
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
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.personalInformation,
        path: ServicePortalPath.SettingsPersonalInformation,
        render: () => lazy(() => import('./screens/UserProfile/UserProfile')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-phone-number',
          defaultMessage: 'Breyta símanúmeri',
        }),
        path: ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
        render: () =>
          lazy(() => import('./screens/EditPhoneNumber/EditPhoneNumber')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-email',
          defaultMessage: 'Breyta netfangi',
        }),
        path: ServicePortalPath.SettingsPersonalInformationEditEmail,
        render: () => lazy(() => import('./screens/EditEmail/EditEmail')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-language',
          defaultMessage: 'Breyta tungumáli',
        }),
        path: ServicePortalPath.SettingsPersonalInformationEditLanguage,
        render: () => lazy(() => import('./screens/EditLanguage/EditLanguage')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:edit-nudge',
          defaultMessage: 'Breyta Hnippi',
        }),
        path: ServicePortalPath.SettingsPersonalInformationEditNudge,
        render: () => lazy(() => import('./screens/EditNudge/EditNudge')),
      },
      {
        name: m.messages,
        path: ServicePortalPath.MessagesRoot,
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
      {
        name: defineMessage({
          id: 'sp.settings:email-confirmation',
          defaultMessage: 'Staðfesta netfang',
        }),
        path: ServicePortalPath.SettingsPersonalInformationEmailConfirmation,
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
      if (
        process.env.NODE_ENV !== 'development' &&
        res.data?.getUserProfile === null
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
