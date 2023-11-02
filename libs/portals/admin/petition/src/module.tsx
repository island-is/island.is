import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { PetitionPaths } from './lib/paths'
import { overviewLoader } from './screens/Overview/Overview.loader'
import { petitionListLoader } from './screens/PetitionList/PetitionList.loader'
import { updateListAction } from './components/ListActions/UpdateList/UpdateList.action'
import { AdminPortalScope } from '@island.is/auth/scopes'

const Overview = lazy(() => import('./screens/Overview'))
const PetitionList = lazy(() => import('./screens/PetitionList'))

const allowedScopes: string[] = [AdminPortalScope.petitionsAdmin]

export const petitionModule: PortalModule = {
  name: m.petitionsTitle,
  layout: 'default',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    {
      name: m.petitionListsOverview,
      path: PetitionPaths.PetitionsRoot,
      element: <Overview />,
      loader: overviewLoader(props),
    },
    {
      name: m.petitionList,
      path: PetitionPaths.PetitionList,
      element: <PetitionList />,
      loader: petitionListLoader(props),
      action: updateListAction(props),
    },
  ],
}
