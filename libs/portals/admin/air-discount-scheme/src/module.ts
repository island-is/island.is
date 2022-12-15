import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { AirDiscountSchemePaths } from './lib/paths'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))
const CreateDiscount = lazy(() =>
  import('./screens/CreateDiscount/CreateDiscount'),
)

export const airDiscountSchemeAdminModule: PortalModule = {
  name: m.airDiscountScheme,
  widgets: () => [],
  layout: 'full',
  routes: ({ userInfo }) => [
    {
      name: m.overview,
      path: AirDiscountSchemePaths.Root,
      enabled: userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
      render: () => OverviewScreen,
    },
    {
      name: m.createDiscount,
      path: AirDiscountSchemePaths.CreateDiscount,
      enabled: userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
      render: () => CreateDiscount,
    },
  ],
}
