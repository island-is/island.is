import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'

const rootName = defineMessage({
  id: 'sp.air-discount',
  defaultMessage: 'Loftbrú',
})

export const airDiscountModule: PortalModule = {
  name: rootName,
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.AirDiscountRoot,
      enabled: true,
      render: () =>
        lazy(() => import('./screens/AirDiscountOverview/AirDiscountOverview')),
    },
  ],
}
