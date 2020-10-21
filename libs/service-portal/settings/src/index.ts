import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

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
      {
        name: 'Mín réttindi',
        path: ServicePortalPath.StillingarUmbod,
        render: () =>
          lazy(() => import('./screens/DelegationGreeting/DelegationGreeting')),
      },
      {
        name: defineMessage({
          id: 'service-portal:profile-info',
          defaultMessage: 'Mínar upplýsingar',
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
    ]

    return routes
  },
}
