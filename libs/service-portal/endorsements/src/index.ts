import { lazy } from 'react'
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
    {
      name: m.endorsements,
      path: ServicePortalPath.Petitions,
      render: () => lazy(() => import('./screens/Petitions')),
    },
  ],
}
