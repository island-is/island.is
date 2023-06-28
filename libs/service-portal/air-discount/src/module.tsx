import React, { lazy } from 'react'
import { defineMessage } from 'react-intl'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'
import { AirDiscountPaths } from './lib/paths'

const AirDiscountOverview = lazy(() =>
  import('./screens/AirDiscountOverview/AirDiscountOverview'),
)

export const airDiscountModule: PortalModule = {
  name: defineMessage({
    id: 'sp.air-discount',
    defaultMessage: 'Loftbrú',
  }),
  featureFlag: Features.servicePortalAirDiscountModule,
  enabled: ({ isCompany }) => !isCompany,
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
