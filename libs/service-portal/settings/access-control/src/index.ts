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
          id: 'service.portal.settings.accessControl:root-title',
          defaultMessage: 'Aðgangsstýring',
        }),
        path: ServicePortalPath.SettingsAccessControl,
        render: () => lazy(() => import('./screens/AccessControl')),
      },
      {
        name: defineMessage({
          id: 'service.portal.settings.accessControl:root-grant-ritle',
          defaultMessage: 'Veita aðgang',
        }),
        path: ServicePortalPath.SettingsAccessControlGrant,
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: defineMessage({
          id: 'service.portal.settings.accessControl:root-access-title',
          defaultMessage: 'Aðgangur',
        }),
        path: ServicePortalPath.SettingsAccessControlAccess,
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
