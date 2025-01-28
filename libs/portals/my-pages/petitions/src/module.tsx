import { lazy } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { EndorsementsScope } from '@island.is/auth/scopes'
import { PetitionPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const Petitions = lazy(() => import('./screens/Petitions'))
const ViewSignedPetition = lazy(() => import('./screens/ViewSignedList'))
const ViewOwnedPetition = lazy(() => import('./screens/ViewOwnedList'))

export const petitionsModule: PortalModule = {
  name: 'Undirskriftalistar',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.generalPetitions,
        path: PetitionPaths.RootPath,
        element: <Navigate to={PetitionPaths.Petitions} replace />,
      },
      {
        name: m.generalPetitions,
        path: PetitionPaths.Petitions,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <Petitions />,
      },
      {
        name: m.generalPetitions,
        path: PetitionPaths.PetitionList,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <ViewSignedPetition />,
      },
      {
        name: m.generalPetitions,
        path: PetitionPaths.PetitionListOwned,
        enabled: userInfo.scopes.includes(EndorsementsScope.main),
        element: <ViewOwnedPetition />,
      },
    ]

    return applicationRoutes
  },
}
