import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DocumentProviderPaths } from './paths'

export const documentProviderNavigationRoutes = [
  {
    name: m.overview,
    path: DocumentProviderPaths.DocumentProviderOverview,
    activeIfExact: true,
  },
  {
    name: m.paper,
    path: DocumentProviderPaths.DocumentProviderPaper,
    activeIfExact: true,
  },
  {
    name: m.catAndTypeName,
    path: DocumentProviderPaths.DocumentProviderCategoryAndType,
    activeIfExact: true,
  },
]

export const baseDocumentProviderNavigation: PortalNavigationItem = {
  name: m.rootName,
  path: DocumentProviderPaths.DocumentProviderRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.rootName,
}
