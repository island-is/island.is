import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { listsLoader } from './screens-presidential/AllLists/AllLists.loader'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { listLoader } from './screens-presidential/List/List.loader'
import { Constituencies } from './lib/utils'

/* parliamentary */
const ParliamentaryRoot = lazy(() => import('./screens-parliamentary'))
const ParliamentaryConstituency = lazy(() =>
  import('./screens-parliamentary/SingleConstituencyView'),
)
const ParliamentaryList = lazy(() =>
  import('./screens-parliamentary/SingleListView'),
)

/* presidential */
const AllLists = lazy(() => import('./screens-presidential/AllLists'))
const List = lazy(() => import('./screens-presidential/List'))

const allowedScopes: string[] = [
  AdminPortalScope.signatureCollectionManage,
  AdminPortalScope.signatureCollectionProcess,
]

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollection,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    /* ------ Parliamentary ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      element: <ParliamentaryRoot />,
    },
    {
      name: Constituencies.Nordausturkjordaemi,
      path: SignatureCollectionPaths.ParliamentaryNordausturkjordaemi,
      element: <ParliamentaryConstituency />,
    },
    {
      name: Constituencies.Nordvesturkjordaemi,
      path: SignatureCollectionPaths.ParliamentaryNordvesturkjordaemi,
      element: <ParliamentaryConstituency />,
    },
    {
      name: Constituencies.ReykjavikurkjordaemiNordur,
      path: SignatureCollectionPaths.ParliamentaryReykjavikurkjordaemiNordur,
      element: <ParliamentaryConstituency />,
    },
    {
      name: Constituencies.ReykjavikurkjordaemiSudur,
      path: SignatureCollectionPaths.ParliamentaryReykjavikurkjordaemiSudur,
      element: <ParliamentaryConstituency />,
    },
    {
      name: Constituencies.Sudurkjordaemi,
      path: SignatureCollectionPaths.ParliamentarySudurkjordaemi,
      element: <ParliamentaryConstituency />,
    },
    {
      name: Constituencies.Sudvesturkjordaemi,
      path: SignatureCollectionPaths.ParliamentarySudvesturkjordaemi,
      element: <ParliamentaryConstituency />,
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.ParliamentaryNordausturkjordaemiList,
      element: <ParliamentaryList />,
    },

    /* ------ Presidential ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.PresidentialLists,
      element: (
        <AllLists
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listsLoader(props),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.PresidentialList,
      element: (
        <List
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listLoader(props),
    },
  ],
}
