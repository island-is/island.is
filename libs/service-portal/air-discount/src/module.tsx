import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { ApiScope } from '@island.is/auth/scopes'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'

const rootName = defineMessage({
  id: 'sp.air-discount',
  defaultMessage: 'Loftbrú',
})

const AirDiscountOverview = lazy(() =>
  import('./screens/AirDiscountOverview/AirDiscountOverview'),
)

export const airDiscountModule: PortalModule = {
  name: rootName,
  featureFlag: Features.servicePortalAirDiscountModule,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => {
    const routes: PortalRoute[] = [
      {
        name: rootName,
        path: ServicePortalPath.AirDiscountRoot,
        enabled: userInfo.scopes.includes(ApiScope.internal),
        element: <AirDiscountOverview />,
      },
    ]
    return routes
  },
}
