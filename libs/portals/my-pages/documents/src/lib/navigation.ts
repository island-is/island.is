import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from './paths'

export const documentsNavigation: PortalNavigationItem = {
  name: m.documents,
  path: DocumentsPaths.ElectronicDocumentsRoot,
  icon: {
    icon: 'mail',
  },
  subscribesTo: 'documents',
  description: m.documentsDescription,
}
