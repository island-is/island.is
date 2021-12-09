import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const wipModule: ServicePortalModule = {
  name: 'Í vinnslu',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Stillingar',
      path: ServicePortalPath.SettingsRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/SettingsWIP/SettingsWIP')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.assets),
      render: () =>
        lazy(() => import('./screens/AssetsVehicles/AssetsVehicles')),
    },
  ],
}
