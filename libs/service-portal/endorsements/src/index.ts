import { lazy } from 'react'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
  ServicePortalModuleProps,
} from '@island.is/service-portal/core'
import { EndorsementsScope } from '@island.is/auth/scopes'


export const endorsementsModule: ServicePortalModule = {
  name: 'Meðmæli',
  widgets: () => [],
  routes: () => [
    {
      name: m.endorsements,
      path: ServicePortalPath.Petitions,
      render: () => lazy(() => import('./screens/Endorsements')),
    },
  ],
}

const hasGeneralPetitionAdminScope = (user: ServicePortalModuleProps) => {
  for (const [key, value] of Object.entries(user.userInfo.scopes)) {
    console.log(value)
    if (value == EndorsementsScope.admin) {
      return true
    }
  }
  return false
}
export const petitionsModule: ServicePortalModule = {
  name: 'Almennir undirskriftalistar',
  widgets: () => [],
  routes: ({userInfo}) => {
    const applicationRoutes = [
      {
        name: m.endorsements,
        path: ServicePortalPath.Petitions,
        render: () => lazy(() => import('./screens/Petitions')),
      },
      {
        name: m.endorsements,
        path: ServicePortalPath.PetitionList,
        render: () => lazy(() => import('./screens/ViewPetition')),
      },
      {
        name: m.endorsementsAdmin,
        path: ServicePortalPath.PetitionsAdminView,
        enabled: userInfo.scopes.includes(EndorsementsScope.admin),
        render: () => lazy(() => import('./screens/PetitionsAdmin')),
      },
      {
        name: m.endorsementsAdmin,
        path: ServicePortalPath.PetitionListAdmin,
        enabled: userInfo.scopes.includes(EndorsementsScope.admin),
        render: () => lazy(() => import('./screens/ViewPetitionAdmin')),
      },
    ]

    console.log(userInfo)
    // const adminScope = hasGeneralPetitionAdminScope(userInfo)

    // if (adminScope) {
      // applicationRoutes.push(
      //   {
      //     name: m.endorsementsAdmin,
      //     path: ServicePortalPath.PetitionsAdminView,
      //     enabled: userInfo.scopes.includes(EndorsementsScope.admin),
      //     render: () => lazy(() => import('./screens/PetitionsAdmin')),
      //   },
      //   {
      //     name: m.endorsementsAdmin,
      //     path: ServicePortalPath.PetitionListAdmin,
      //     enabled: userInfo.scopes.includes(EndorsementsScope.admin),
      //     render: () => lazy(() => import('./screens/ViewPetitionAdmin')),
      //   },
      // )
    // }

    return applicationRoutes
  },
}
