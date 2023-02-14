import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { ApiScope } from '@island.is/auth/scopes'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'

const rootName = defineMessage({
  id: 'sp.air-discount',
  defaultMessage: 'Loftbrú',
})

export const airDiscountModule: PortalModule = {
  name: rootName,
  featureFlag: Features.servicePortalAirDiscountModule,
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.AirDiscountRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () =>
        lazy(() => import('./screens/AirDiscountOverview/AirDiscountOverview')),
    },
  ],
}
