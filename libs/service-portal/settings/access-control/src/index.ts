import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

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
      {
        name: defineMessage({
          id: 'service.portal:accessControlGrant',
          defaultMessage: 'Veita aðgang',
        }),
        path: ServicePortalPath.SettingsAccessControlGrant,
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
    ]

    return routes
  },
}
