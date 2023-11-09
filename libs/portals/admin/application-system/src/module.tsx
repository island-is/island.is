import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { ApplicationSystemPaths } from './lib/paths'

const Overview = lazy(() => import('./screens/Overview/Overview'))
const InstitutionOverview = lazy(() =>
  import('./screens/Overview/InstitutionOverview'),
)

export const applicationSystemAdminModule: PortalModule = {
  name: m.applicationSystem,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.applicationSystem),
  routes: (props) => [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Root,
      element: <Overview />,
    },
    {
      name: 'Stofnanir',
      path: ApplicationSystemPaths.Institution,
      element: <InstitutionOverview />,
    },
  ],
}
