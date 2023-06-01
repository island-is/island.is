import { PortalNavigationItem } from '@island.is/portals/core'
import { PetitionPaths } from './paths'
import { m } from './messages'

export const petitionNavigation: PortalNavigationItem = {
  name: m.petitionsTitle,
  icon: {
    icon: 'settings',
  },
  description: m.intro,
  path: PetitionPaths.PetitionsRoot,
  children: [
    {
      name: m.petitionListsOverview,
      path: PetitionPaths.PetitionsRoot,
      activeIfExact: true,
    },
  ],
}
