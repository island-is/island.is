import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { municipalListsLoader, parliamentaryListsLoader, presidentialListsLoader } from './loaders/AllLists.loader'
import { listLoader } from './loaders/List.loader'
import { allowedScopes } from './lib/utils'
import { AdminPortalScope } from '@island.is/auth/scopes'

/* parliamentary */
const ParliamentaryRoot = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryConstituency = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryList = lazy(() => import('./screens-parliamentary/List'))

/* presidential */
const AllLists = lazy(() => import('./screens-presidential/AllLists'))
const List = lazy(() => import('./screens-presidential/List'))

/* municipal */
const AllMunicipalities = lazy(() => import('./screens-municipal/AllMunicipalities'))
const Municipality = lazy(() => import('./screens-municipal/Municipality'))
const MunicipalList = lazy(() => import('./screens-municipal/List'))

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
      element: (
        <ParliamentaryRoot
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: parliamentaryListsLoader(props),
    },
    {
      name: m.signatureListsConstituencyTitle,
      path: SignatureCollectionPaths.ParliamentaryConstituency,
      element: (
        <ParliamentaryConstituency
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: parliamentaryListsLoader(props),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.ParliamentaryConstituencyList,
      element: (
        <ParliamentaryList
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listLoader(props),
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
      loader: presidentialListsLoader(props),
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

    /* ------ Municipal ------ */
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalRoot,
      element: <AllMunicipalities />,
      loader: municipalListsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.SingleMunicipality,
      element: <Municipality />,
      loader: municipalListsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalList,
      element: <MunicipalList />,
      loader: listLoader(props),
    },
  ],
}
