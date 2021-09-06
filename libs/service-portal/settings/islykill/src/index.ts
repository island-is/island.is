import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const islykillModule: ServicePortalModule = {
  name: 'Íslykill',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: defineMessage({
          id: 'service.portal.settings.islykill:root-title',
          defaultMessage: 'Íslykill',
        }),
        path: ServicePortalPath.SettingsIslykill,
        render: () => lazy(() => import('./screens/Islykill')),
      },
    ]

    return routes
  },
}
