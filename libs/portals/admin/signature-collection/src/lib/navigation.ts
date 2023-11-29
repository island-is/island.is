import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m } from './messages'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.petitionsTitle,
  icon: {
    icon: 'settings',
  },
  description: m.intro,
  path: SignatureCollectionPaths.PetitionsRoot,
  children: [
    {
      name: m.petitionListsOverview,
      path: SignatureCollectionPaths.PetitionsRoot,
      activeIfExact: true,
    },
  ],
}
