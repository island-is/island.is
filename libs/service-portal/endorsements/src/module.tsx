import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { PetitionPaths } from './lib/paths'

const Petitions = lazy(() => import('./screens/Petitions'))
const ViewPetition = lazy(() => import('./screens/ViewPetition'))
const PetitionsAdmin = lazy(() => import('./screens/PetitionsAdmin'))
const ViewPetitionAdmin = lazy(() => import('./screens/ViewPetitionAdmin'))

export const petitionsModule: PortalModule = {
  name: 'Almennir undirskriftalistar',
  featureFlag: Features.servicePortalPetitionsModule,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.endorsements,
        path: PetitionPaths.Petitions,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <Petitions />,
      },
      {
        name: m.endorsements,
        path: PetitionPaths.PetitionList,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <ViewPetition />,
      },
    ]

    if (userInfo.scopes.includes(EndorsementsScope.admin)) {
      applicationRoutes.push(
        {
          name: m.endorsementsAdmin,
          path: PetitionPaths.PetitionsAdminView,
          element: <PetitionsAdmin />,
        },
        {
          name: m.endorsementsAdmin,
          path: PetitionPaths.PetitionListAdmin,
          element: <ViewPetitionAdmin />,
        },
      )
    }

    return applicationRoutes
  },
}
