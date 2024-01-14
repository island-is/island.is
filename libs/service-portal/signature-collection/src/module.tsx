import { lazy } from 'react'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'
import { ApiScope } from '@island.is/auth/scopes'

const SignatureLists = lazy(() => import('./screens'))
const ViewList = lazy(() => import('./screens/CandidateView/ViewList'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  featureFlag: Features.servicePortalSignatureCollection,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.Lists,
        enabled: userInfo.scopes.includes(ApiScope.signatureCollection),
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
