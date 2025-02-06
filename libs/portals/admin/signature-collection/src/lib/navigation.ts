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
      name: 'Sveitarstjórnarkosningar',
      path: SignatureCollectionPaths.MunicipalRoot,
      activeIfExact: true,
      children: [
        {
          name: 'test submenu 1',
          path: SignatureCollectionPaths.MunicipalArea1,
          activeIfExact: true,
        },
        {
          name: 'test submenu 2',
          path: SignatureCollectionPaths.MunicipalArea2,
          activeIfExact: true,
        },
      ]
    },
    {
      name: m.parliamentaryCollectionTitle,
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
