import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const islykillModule: ServicePortalModule = {
  name: 'Íslykill',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: defineMessage({
          id: 'service.portal.settings.islykill:root-title',
          defaultMessage: 'Íslykill',
        }),
        path: ServicePortalPath.SettingsIslykill,
        enabled: userInfo.scopes.includes(ApiScope.internal),
        render: () => lazy(() => import('./screens/Islykill')),
      },
    ]

    return routes
  },
}
