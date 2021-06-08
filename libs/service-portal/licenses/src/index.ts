import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const licensesModule: ServicePortalModule = {
  name: 'Skilríki',
  widgets: () => [],
  routes: () => [
    {
      name: 'Skilríki',
      path: ServicePortalPath.LicensesRoot,
      render: () => lazy(() => import('./screens/Licenses')),
    },
  ],
}
