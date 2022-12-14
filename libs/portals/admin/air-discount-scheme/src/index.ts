import { lazy } from 'react'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))

export const airDiscountSchemeAdminModule: PortalModule = {
  name: 'Loftbrú',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Yfirlit',
      path: '/loftbru',
      enabled: userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
      render: () => OverviewScreen,
    },
  ],
}
