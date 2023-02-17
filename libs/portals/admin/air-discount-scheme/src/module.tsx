import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { AirDiscountSchemePaths } from './lib/paths'
import { overviewLoader } from './screens/Overview/Overview.loader'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))
const CreateDiscount = lazy(() =>
  import('./screens/CreateDiscount/CreateDiscount'),
)

export const airDiscountSchemeAdminModule: PortalModule = {
  name: m.airDiscountScheme,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.airDiscountScheme),
  routes: (props) => [
    {
      name: m.overview,
      path: AirDiscountSchemePaths.Root,
      element: <OverviewScreen />,
      loader: overviewLoader(props),
    },
    {
      name: m.createDiscount,
      path: AirDiscountSchemePaths.CreateDiscount,
      element: <CreateDiscount />,
    },
  ],
}
