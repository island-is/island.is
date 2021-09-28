import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const wipModule: ServicePortalModule = {
  name: 'Í vinnslu',
  widgets: () => [],
  routes: () => [
    {
      name: 'Stillingar',
      path: ServicePortalPath.SettingsRoot,
      render: () => lazy(() => import('./screens/SettingsWIP/SettingsWIP')),
    },
    {
      name: 'Fjármál',
      path: ServicePortalPath.FinanceWIP,
      render: () => lazy(() => import('./screens/FinanceWIP/FinanceWIP')),
    },
  ],
}
