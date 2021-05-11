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

export const accessControlModule: ServicePortalModule = {
  name: 'Aðgangsstýring',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: defineMessage({
          id: 'service.portal:accessControl',
          defaultMessage: 'Aðgangsstýring',
        }),
        path: ServicePortalPath.SettingsAccessControl,
        render: () => lazy(() => import('./screens/AccessControl')),
      },
    ]

    return routes
  },
}
