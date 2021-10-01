import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const endorsementsModule: ServicePortalModule = {
  name: 'Meðmæli',
  widgets: () => [],
  routes: () => [
    {
      name: m.endorsements,
      path: ServicePortalPath.Endorsements,
      render: () => lazy(() => import('./screens/Endorsements')),
    },
  ],
}
