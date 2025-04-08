import { lazy } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'

const SignatureListsParliamentary = lazy(() =>
  import('./screens/Parliamentary/'),
)
const SignatureListsPresidential = lazy(() => import('./screens/Presidential'))
const SignatureListsMunicipal = lazy(() => import ('./screens/Municipal'))

const ViewListPresidential = lazy(() =>
  import('./screens/Presidential/OwnerView/ViewList'),
)
const ViewListParliamentary = lazy(() =>
  import('./screens/Parliamentary/OwnerView/ViewList'),
)
const ViewListMunicipal = lazy(() =>
  import('./screens/Parliamentary/OwnerView/ViewList'),
)

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      // General Petitions
      {
        name: m.signatureCollectionParliamentaryLists,
        path: SignatureCollectionPaths.RootPath,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: (
          /* Default path to general petitions since these are always ongoing */
          <Navigate to={SignatureCollectionPaths.GeneralPetitions} replace />
        ),
      },
      // Parliamentary
      {
        name: m.signatureCollectionParliamentaryLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionParliamentaryLists,
        element: <SignatureListsParliamentary />,
      },
      {
        name: m.signatureCollectionParliamentaryLists,
        path: SignatureCollectionPaths.ViewParliamentaryList,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: <ViewListParliamentary />,
      },
      // Presidential
      {
        name: m.signatureCollectionPresidentialLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionLists,
        key: 'PresidentialLists',
        element: <SignatureListsPresidential />,
      },
      {
        name: m.signatureCollectionPresidentialLists,
        path: SignatureCollectionPaths.ViewList,
        key: 'PresidentialLists',
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: <ViewListPresidential />,
      },
       // Municipal
       {
        name: 'Sveitó',
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionMunicipalLists,
        key: 'PresidentialLists',
        element: <SignatureListsMunicipal />,
      },
      {
        name: 'Sveitó',
        path: SignatureCollectionPaths.ViewMunicipalList,
        key: 'PresidentialLists',
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: <ViewListMunicipal />,
      },
    ]

    return applicationRoutes
  },
  companyRoutes: ({ userInfo }) => [
    // Parliamentary
    {
      name: m.signatureCollectionParliamentaryLists,
      path: SignatureCollectionPaths.CompanySignatureCollectionParliamentaryLists,
      enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
      element: <SignatureListsParliamentary />,
    },
    {
      name: m.signatureCollectionParliamentaryLists,
      path: SignatureCollectionPaths.CompanyViewParliamentaryList,
      enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
      element: <ViewListParliamentary />,
    },
  ],
}
