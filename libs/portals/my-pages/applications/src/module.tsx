import { lazy } from 'react'
import { ApplicationScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule } from '@island.is/portals/core'
import { ApplicationsPaths } from './lib/paths'

const OverviewScreen = lazy(() => import('./screens/Overview'))

export const applicationsModule: PortalModule = {
  name: m.applications,
  routes: ({ userInfo }) => [
    {
      name: m.applications,
      path: ApplicationsPaths.ApplicationRoot,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      element: <OverviewScreen />,
    },
    {
      name: m.inProgressApplications,
      path: ApplicationsPaths.ApplicationInProgressApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      element: <OverviewScreen />,
    },
    {
      name: m.unfinishedApplications,
      path: ApplicationsPaths.ApplicationIncompleteApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      element: <OverviewScreen />,
    },
    {
      name: m.finishedApplications,
      path: ApplicationsPaths.ApplicationCompleteApplications,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      element: <OverviewScreen />,
    },
  ],
}
