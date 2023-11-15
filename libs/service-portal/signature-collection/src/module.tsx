import { lazy } from 'react'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'

const SignatureLists = lazy(() => import('./screens/SignatureLists'))
const ViewList = lazy(() => import('./screens/ViewList'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  routes: () => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.Lists,
        element: <SignatureLists />,
      },
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.ViewList,
        element: <ViewList />,
      },
    ]

    return applicationRoutes
  },
}
