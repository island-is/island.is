import { lazy } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'

const SignatureCollectionParliamentary = lazy(() =>
  import('./screens/Parliamentary/'),
)
const SignatureCollectionPresidential = lazy(() =>
  import('./screens/Presidential'),
)
const SignatureCollectionMunicipal = lazy(() => import('./screens/Municipal'))

const ViewListPresidential = lazy(() =>
  import('./screens/Presidential/OwnerView/ViewList'),
)
const ViewListParliamentary = lazy(() =>
  import('./screens/Parliamentary/OwnerView/ViewList'),
)
const ViewListMunicipal = lazy(() =>
  import('./screens/Municipal/OwnerView/ViewList'),
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
          /* Default path to municipal lists since these are next */
          <Navigate
            to={SignatureCollectionPaths.SignatureCollectionMunicipalLists}
            replace
          />
        ),
      },
      // Parliamentary
      {
        name: m.signatureCollectionParliamentaryLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionParliamentaryLists,
        key: 'ParliamentaryLists',
        element: <SignatureCollectionParliamentary />,
      },
      {
        name: m.signatureCollectionParliamentaryLists,
        path: SignatureCollectionPaths.ViewParliamentaryList,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        key: 'ParliamentaryLists',
        element: <ViewListParliamentary />,
      },
      // Presidential
      {
        name: m.signatureCollectionPresidentialLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionLists,
        key: 'PresidentialLists',
        element: <SignatureCollectionPresidential />,
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
        name: m.signatureCollectionMunicipalLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionMunicipalLists,
        key: 'MunicipalLists',
        element: <SignatureCollectionMunicipal />,
      },
      {
        name: m.signatureCollectionMunicipalLists,
        path: SignatureCollectionPaths.ViewMunicipalList,
        key: 'MunicipalLists',
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
      element: <SignatureCollectionParliamentary />,
    },
    {
      name: m.signatureCollectionParliamentaryLists,
      path: SignatureCollectionPaths.CompanyViewParliamentaryList,
      enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
      element: <ViewListParliamentary />,
    },
  ],
}
