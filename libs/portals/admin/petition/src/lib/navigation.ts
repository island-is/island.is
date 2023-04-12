import { PortalNavigationItem } from '@island.is/portals/core'
import { PetitionPaths } from './paths'
import { m } from './messages'

export const petitionNavigation: PortalNavigationItem = {
  name: m.petitions,
  path: PetitionPaths.Root,
  children: [
    {
      name: m.overview,
      path: PetitionPaths.Root,
      activeIfExact: true,
    },
  ],
}
