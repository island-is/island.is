import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages } from '@island.is/portals/my-pages/core'

import { DocumentsPaths } from './paths'

export const documentsNavigation: PortalNavigationItem = {
  name: m.documents,
  path: DocumentsPaths.ElectronicDocumentsRoot,
  icon: {
    icon: 'mail',
  },
  searchTags: [
    searchTagsMessages.documentsMail,
    searchTagsMessages.documentsMailTwo,
  ],
  subscribesTo: 'documents',
  description: m.documentsDescription,
}
