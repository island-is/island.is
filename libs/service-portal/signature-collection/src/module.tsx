import { lazy } from 'react'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'

const SignatureLists = lazy(() => import('./screens'))
const ViewList = lazy(() => import('./screens/CandidateView/ViewList'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  featureFlag: Features.servicePortalSignatureCollection,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.RootPath,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: (
          <Navigate
            to={SignatureCollectionPaths.SignatureCollectionLists}
            replace
          />
        ),
      },
      {
        name: m.signatureCollectionLists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        path: SignatureCollectionPaths.SignatureCollectionLists,
        element: <SignatureLists />,
      },
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.ViewList,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
        element: <ViewList />,
      },
    ]

    return applicationRoutes
  },
}
