import { PortalNavigationItem } from '@island.is/portals/core'
import { PetitionPaths } from './paths'
import { m } from './messages'

export const petitionNavigation: PortalNavigationItem = {
  name: m.title,
  path: PetitionPaths.PetitionsRoot,
  children: [
    {
      name: m.overview,
      path: PetitionPaths.PetitionsRoot,
      activeIfExact: true,
    },
  ],
}
