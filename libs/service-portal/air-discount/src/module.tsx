import React, { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { AirDiscountPaths } from './lib/paths'

const AirDiscountOverview = lazy(() =>
  import('./screens/AirDiscountOverview/AirDiscountOverview'),
)

export const airDiscountModule: PortalModule = {
  name: 'Loftbrú',
  routes: ({ userInfo }) => [
    {
      name: m.airDiscount,
      path: AirDiscountPaths.AirDiscountRoot,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      element: <AirDiscountOverview />,
    },
  ],
}
