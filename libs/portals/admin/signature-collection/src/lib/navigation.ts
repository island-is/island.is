import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m, parliamentaryMessages } from './messages'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureListsDescription,
  path: SignatureCollectionPaths.ParliamentaryRoot,
  children: [
    {
      name: parliamentaryMessages.signatureListsTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      activeIfExact: true,
    },
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.PresidentialLists,
      activeIfExact: true,
    },
  ],
}
