import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { PetitionPaths } from './lib/paths'
import SingleList from './screens/SingleList/SingleList'
import { overviewLoader } from './screens/Overview/Overview.loader'
import { singleListLoader } from './screens/SingleList/SingleList.loader'
import { updateListAction } from './components/Actions/UpdateList/UpdateList.action'

const OverviewScreen = lazy(() => import('./screens/Overview/Overview'))

export const petitionModule: PortalModule = {
  name: m.title,
  layout: 'default',
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
      action: updateListAction(props),
    },
  ],
}
