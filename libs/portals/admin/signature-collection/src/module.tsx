import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import {
  municipalListsLoader,
  parliamentaryListsLoader,
  presidentialListsLoader,
} from './loaders/AllLists.loader'
import {
  parliamentaryListLoader,
  presidentialListLoader,
  municipalListLoader,
} from './loaders/List.loader'
import {
  allowedScopesAdmin,
  allowedScopesAdminAndMunicipality,
} from './lib/utils'
import { AuthDelegationType } from '@island.is/api/schema'

/* Parliamentary */
const ParliamentaryRoot = lazy(() =>
  import('./screens-parliamentary/AllConstituencies'),
)
const ParliamentaryConstituency = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryList = lazy(() => import('./screens-parliamentary/List'))

/* Presidential */
const AllCandidates = lazy(() => import('./screens-presidential/AllCandidates'))
const CandidateLists = lazy(() =>
  import('./screens-presidential/CandidateLists'),
)
const List = lazy(() => import('./screens-presidential/List'))

/* Municipal */
const AllMunicipalities = lazy(() =>
  import('./screens-municipal/AllMunicipalities'),
)
const Municipality = lazy(() => import('./screens-municipal/Municipality'))
const MunicipalList = lazy(() => import('./screens-municipal/List'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollection,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) =>
      allowedScopesAdminAndMunicipality.includes(scope),
    ),
  routes: (props) => [
    /* ------ Municipal ------ */
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalRoot,
      element: (
        <AllMunicipalities
          // If the user is NOT an admin (LKS or ÞÍ) & have a procuration holder delegation type
          isProcurationHolder={
            !props.userInfo.scopes.some(
              (scope) =>
                allowedScopesAdmin.includes(scope) &&
                props.userInfo.profile.delegationType?.includes(
                  AuthDelegationType.ProcurationHolder,
                ),
            )
          }
        />
      ),
      loader: municipalListsLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.SingleMunicipality,
      element: <Municipality />,
      loader: municipalListsLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalList,
      element: <MunicipalList />,
      loader: municipalListLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },

    /* ------ Parliamentary ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      element: <ParliamentaryRoot />,
      loader: parliamentaryListsLoader(props),
      // Hide the nav for this route if the user does not have the required scopes
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },
    {
      name: m.signatureListsConstituencyTitle,
      path: SignatureCollectionPaths.ParliamentaryConstituency,
      element: <ParliamentaryConstituency />,
      loader: parliamentaryListsLoader(props),
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.ParliamentaryConstituencyList,
      element: <ParliamentaryList />,
      loader: parliamentaryListLoader(props),
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },

    /* ------ Presidential ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.PresidentialListOfCandidates,
      element: <AllCandidates />,
      loader: presidentialListsLoader(props),
      // Hide the nav for this route if the user does not have the required scopes
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.PresidentialCandidateLists,
      element: <CandidateLists />,
      loader: presidentialListsLoader(props),
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.PresidentialList,
      element: <List />,
      loader: presidentialListLoader(props),
      navHide: !props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdmin.includes(scope),
      ),
    },
  ],
}
