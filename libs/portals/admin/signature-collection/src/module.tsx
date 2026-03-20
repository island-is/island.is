import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { useNamespaces } from '@island.is/localization'
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
  allowedScopesMunicipality,
} from './lib/utils'

const SignatureCollectionNamespaceProvider = ({
  children,
}: {
  children: JSX.Element
}) => {
  useNamespaces('admin-portal.signature-collection')
  return children
}

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
        <SignatureCollectionNamespaceProvider>
          <AllMunicipalities
            // If the user is NOT an admin (LKS or ÞÍ) but a municipality
            isMunicipality={
              !props.userInfo.scopes.some((scope) =>
                allowedScopesAdmin.includes(scope),
              ) &&
              props.userInfo.scopes.some((scope) =>
                allowedScopesMunicipality.includes(scope),
              )
            }
          />
        </SignatureCollectionNamespaceProvider>
      ),
      loader: municipalListsLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.SingleMunicipality,
      element: (
        <SignatureCollectionNamespaceProvider>
          <Municipality />
        </SignatureCollectionNamespaceProvider>
      ),
      loader: municipalListsLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalList,
      element: (
        <SignatureCollectionNamespaceProvider>
          <MunicipalList />
        </SignatureCollectionNamespaceProvider>
      ),
      loader: municipalListLoader(props),
      enabled: props.userInfo.scopes.some((scope) =>
        allowedScopesAdminAndMunicipality.includes(scope),
      ),
    },

    /* ------ Parliamentary ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      element: (
        <SignatureCollectionNamespaceProvider>
          <ParliamentaryRoot />
        </SignatureCollectionNamespaceProvider>
      ),
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
      element: (
        <SignatureCollectionNamespaceProvider>
          <ParliamentaryConstituency />
        </SignatureCollectionNamespaceProvider>
      ),
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
      element: (
        <SignatureCollectionNamespaceProvider>
          <ParliamentaryList />
        </SignatureCollectionNamespaceProvider>
      ),
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
      element: (
        <SignatureCollectionNamespaceProvider>
          <AllCandidates />
        </SignatureCollectionNamespaceProvider>
      ),
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
      element: (
        <SignatureCollectionNamespaceProvider>
          <CandidateLists />
        </SignatureCollectionNamespaceProvider>
      ),
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
      element: (
        <SignatureCollectionNamespaceProvider>
          <List />
        </SignatureCollectionNamespaceProvider>
      ),
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
