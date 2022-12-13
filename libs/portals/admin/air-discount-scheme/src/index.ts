import { lazy } from 'react'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'

const CreateDiscount = lazy(() =>
  import('./screens/CreateDiscount/CreateDiscount'),
)
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
    {
      name: 'Handvirkir kóðar',
      path: '/loftbru/handvirkir-kodar',
      enabled: userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
      render: () => CreateDiscount,
    },
  ],
}
