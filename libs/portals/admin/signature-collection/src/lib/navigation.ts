import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m } from './messages'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'receipt',
  },

  description: m.signatureListsDescription,
  path: SignatureCollectionPaths.MunicipalRoot,
  children: [
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalRoot,
    },
    {
      name: m.parliamentaryCollectionTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
    },
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.PresidentialLists,
    },
  ],
}
