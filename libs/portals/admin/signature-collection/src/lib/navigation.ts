import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m } from './messages'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'settings',
  },
  description: m.signatureListsIntro,
  path: SignatureCollectionPaths.SignatureLists,
  children: [
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.SignatureList,
      activeIfExact: true,
    },
  ],
}
