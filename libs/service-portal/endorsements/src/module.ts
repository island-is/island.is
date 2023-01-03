import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { PetitionPaths } from './lib/paths'

export const petitionsModule: PortalModule = {
  name: 'Almennir undirskriftalistar',
  featureFlag: Features.servicePortalPetitionsModule,
  widgets: () => [],
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.endorsements,
        path: PetitionPaths.Petitions,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        render: () => lazy(() => import('./screens/Petitions')),
      },
      {
        name: m.endorsements,
        path: PetitionPaths.PetitionList,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        render: () => lazy(() => import('./screens/ViewPetition')),
      },
    ]

    if (userInfo.scopes.includes(EndorsementsScope.admin)) {
      applicationRoutes.push(
        {
          name: m.endorsementsAdmin,
          path: PetitionPaths.PetitionsAdminView,
          render: () => lazy(() => import('./screens/PetitionsAdmin')),
        },
        {
          name: m.endorsementsAdmin,
          path: PetitionPaths.PetitionListAdmin,
          render: () => lazy(() => import('./screens/ViewPetitionAdmin')),
        },
      )
    }

    return applicationRoutes
  },
}
