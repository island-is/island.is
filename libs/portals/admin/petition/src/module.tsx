import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { PetitionPaths } from './lib/paths'
import SingleList from './screens/SingleList/SingleList'
import { overviewLoader } from './screens/Overview/Overview.loader'
import { singleListLoader } from './screens/SingleList/SingleList.loader'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))

export const petitionModule: PortalModule = {
  name: m.title,
  layout: 'full',
  enabled: ({ userInfo }) => true,
  routes: (props) => [
    {
      name: m.overview,
      path: PetitionPaths.PetitionsRoot,
      element: <OverviewScreen />,
      loader: overviewLoader(props),
    },
    {
      name: m.overview,
      path: PetitionPaths.PetitionsSingle,
      element: <SingleList />,
      loader: singleListLoader(props),
      handle: {
        backPath: PetitionPaths.PetitionsRoot,
      },
    },
  ],
}
