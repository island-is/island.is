import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'

export const endorsementsModule: ServicePortalModule = {
  name: 'Meðmæli',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:endorsements',
        defaultMessage: 'Meðmæli',
      }),
      path: ServicePortalPath.Endorsements,
      render: () => lazy(() => import('./screens/Endorsements')),
    },
  ],
}
