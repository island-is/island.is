import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m, parliamentaryMessages } from './messages'
import { Constituencies } from './utils'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureListsDescription,
  path: SignatureCollectionPaths.ParliamentaryRoot,
  children: [
    {
      name: parliamentaryMessages.listTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      activeIfExact: true,
      children: [
        {
          name: Constituencies.Nordvesturkjordaemi,
          path: SignatureCollectionPaths.ParliamentaryNordvesturkjordaemi,
        },
        {
          name: Constituencies.Nordausturkjordaemi,
          path: SignatureCollectionPaths.ParliamentaryNordausturkjordaemi,
        },
        {
          name: Constituencies.Sudurkjordaemi,
          path: SignatureCollectionPaths.ParliamentarySudurkjordaemi,
        },
        {
          name: Constituencies.Sudvesturkjordaemi,
          path: SignatureCollectionPaths.ParliamentarySudvesturkjordaemi,
        },
        {
          name: Constituencies.ReykjavikurkjordaemiSudur,
          path: SignatureCollectionPaths.ParliamentaryReykjavikurkjordaemiSudur,
        },
        {
          name: Constituencies.ReykjavikurkjordaemiNordur,
          path: SignatureCollectionPaths.ParliamentaryReykjavikurkjordaemiNordur,
        },
      ],
    },
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.PresidentialLists,
      activeIfExact: true,
    },
  ],
}
