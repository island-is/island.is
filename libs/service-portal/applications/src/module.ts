import { lazy } from 'react'
import { ApplicationScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { ApplicationsPaths } from './lib/paths'

const OverviewScreen = lazy(() => import('./screens/Overview'))
export const applicationsModule: PortalModule = {
  name: m.applications,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.applications,
      path: ApplicationsPaths.ApplicationRoot,
      enabled: userInfo.scopes.includes(ApplicationScope.read),
      render: () => OverviewScreen,
    },
    // Will be added later when we have standardised the states of applications.
    // {
    //   name: m.inProgressApplications,
    //   path: ServicePortalPath.ApplicationInProgressApplications,
    //   enabled: userInfo.scopes.includes(ApplicationScope.read),
    //   render: () => OverviewScreen,
    // },
    // {
    //   name: m.unfinishedApplications,
    //   path: ServicePortalPath.ApplicationIncompleteApplications,
    //   enabled: userInfo.scopes.includes(ApplicationScope.read),
    //   render: () => OverviewScreen,
    // },
    // {
    //   name: m.finishedApplications,
    //   path: ServicePortalPath.ApplicationCompleteApplications,
    //   enabled: userInfo.scopes.includes(ApplicationScope.read),
    //   render: () => OverviewScreen,
    // },
  ],
}
