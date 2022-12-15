import { lazy } from 'react'

import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { AirDiscountSchemePaths } from './lib/paths'
import { m } from './lib/messages'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))

export const airDiscountSchemeAdminModule: PortalModule = {
  name: m.airDiscountScheme,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.overview,
      path: AirDiscountSchemePaths.Root,
      enabled: userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
      render: () => OverviewScreen,
    },
  ],
}
