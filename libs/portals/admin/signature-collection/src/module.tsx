import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { listsLoader } from './screens/AllLists/AllLists.loader'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { listLoader } from './screens/List/List.loader'

const AllLists = lazy(() => import('./screens/AllLists'))
const List = lazy(() => import('./screens/List'))

const allowedScopes: string[] = [AdminPortalScope.petitionsAdmin]

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollection,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.SignatureLists,
      element: <AllLists />,
      loader: listsLoader(props),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.SignatureList,
      element: <List />,
      loader: listLoader(props),
    },
  ],
}
