import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { SignatureCollectionPaths } from './lib/paths'

const SignatureLists = lazy(() => import('./screens/SignatureLists'))

export const petitionsModule: PortalModule = {
  name: 'Undirskriftalistar',
  featureFlag: Features.servicePortalPetitionsModule,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.petitions,
        path: SignatureCollectionPaths.Lists,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <SignatureLists />,
      },
    ]

    return applicationRoutes
  },
}
