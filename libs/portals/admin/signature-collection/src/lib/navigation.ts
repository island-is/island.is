import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m } from './messages'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'settings',
  },
  description: m.signatureListsDescription,
  path: SignatureCollectionPaths.SignatureLists,
  children: [
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.SignatureLists,
      activeIfExact: true,
    },
  ],
}
