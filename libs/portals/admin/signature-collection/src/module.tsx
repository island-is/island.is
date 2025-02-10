import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { listsLoader } from './loaders/AllLists.loader'
import { listLoader } from './loaders/List.loader'
import { allowedScopes } from './lib/utils'
import { AdminPortalScope } from '@island.is/auth/scopes'

/* municipal */
const LandAreas = lazy(() => import('./screens-municipal/LandAreas'))

/* parliamentary */
const ParliamentaryRoot = lazy(() => import('./screens-parliamentary'))
const ParliamentaryConstituency = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryList = lazy(() => import('./screens-parliamentary/List'))

/* presidential */
const AllLists = lazy(() => import('./screens-presidential/AllLists'))
const List = lazy(() => import('./screens-presidential/List'))

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
      loader: listsLoader(props),
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
      loader: listsLoader(props),
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

    /* ------ Municipal ------ */
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaHofudborgarsvaedi,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaSudurnes,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaVesturland,
      element: <LandAreas />,
      loader: listLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaVestfirdir,
      element: <LandAreas />,
      loader: listLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaNordurlandVestra,
      element: <LandAreas />,
      loader: listLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaNordurlandEystra,
      element: <LandAreas />,
      loader: listLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaAusturland,
      element: <LandAreas />,
      loader: listLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaSudurland,
      element: <LandAreas />,
      loader: listLoader(props),
    },
  ],
}
