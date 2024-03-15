import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { messages } from '../utils/messages'
import { DocumentsPaths } from './paths'

export const documentsNavigation: PortalNavigationItem = {
  name: m.documents,
  path: DocumentsPaths.ElectronicDocumentsRoot,
  icon: {
    icon: 'mail',
  },
  subscribesTo: 'documents',
  description: m.documentsDescription,
  heading: messages.intro,
}
