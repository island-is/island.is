import { lazy } from 'react'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'

const SignatureListsParliamentary = lazy(() =>
  import('./screens/parliamentary/owner'),
)
const SignatureLists = lazy(() => import('./screens'))
const ViewList = lazy(() => import('./screens/CandidateView/ViewList'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  featureFlag: Features.servicePortalSignatureCollection,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.signatureCollectionParliamentaryLists,
        path: SignatureCollectionPaths.RootPath,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: (
          <Navigate
            to={SignatureCollectionPaths.SignatureCollectionParliamentaryLists}
            replace
          />
        ),
      },
      {
        name: m.signatureCollectionParliamentaryLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionParliamentaryLists,
        element: <SignatureListsParliamentary />,
      },
      {
        name: m.signatureCollectionPresidentialLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionLists,
        element: <SignatureLists />,
      },
      {
        name: m.signatureCollectionPresidentialLists,
        path: SignatureCollectionPaths.ViewList,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: <ViewList />,
      },
    ]

    return applicationRoutes
  },
}
