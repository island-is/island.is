import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { ApplicationSystemPaths } from './lib/paths'

const ExampleScreen = lazy(() => import('./screens/ExampleScreen/example'))

export const applicationSystemAdminModule: PortalModule = {
  name: m.applicationSystem,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.applicationSystem),
  routes: () => [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Root,
      render: () => ExampleScreen,
    },
  ],
}
