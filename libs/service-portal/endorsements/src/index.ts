import { lazy } from 'react'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'

export const petitionsModule: ServicePortalModule = {
  name: 'Almennir undirskriftalistar',
  featureFlag: Features.servicePortalPetitionsModule,
  widgets: () => [],
  routes: ({ userInfo }) => {
    const applicationRoutes: ServicePortalRoute[] = [
      {
        name: m.endorsements,
        path: ServicePortalPath.Petitions,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        render: () => lazy(() => import('./screens/Petitions')),
      },
      {
        name: m.endorsements,
        path: ServicePortalPath.PetitionList,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        render: () => lazy(() => import('./screens/ViewPetition')),
      },
    ]

    if (userInfo.scopes.includes(EndorsementsScope.admin)) {
      applicationRoutes.push(
        {
          name: m.endorsementsAdmin,
          path: ServicePortalPath.PetitionsAdminView,
          render: () => lazy(() => import('./screens/PetitionsAdmin')),
        },
        {
          name: m.endorsementsAdmin,
          path: ServicePortalPath.PetitionListAdmin,
          render: () => lazy(() => import('./screens/ViewPetitionAdmin')),
        },
      )
    }

    return applicationRoutes
  },
}
