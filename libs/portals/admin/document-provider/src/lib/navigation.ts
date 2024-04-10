import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DocumentProviderPaths } from './paths'

export const documentProviderNavigation: PortalNavigationItem = {
  name: m.rootName,
  path: DocumentProviderPaths.DocumentProviderRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.rootName,
  children: [
    {
      name: m.overview,
      path: DocumentProviderPaths.DocumentProviderOverview,
      icon: {
        icon: 'receipt',
      },
      description: m.overview,
    },
    {
      name: m.paper,
      path: DocumentProviderPaths.DocumentProviderPaper,
      description: m.paper,
    },
    {
      name: m.catAndTypeName,
      path: DocumentProviderPaths.DocumentProviderCategoryAndType,
      description: m.catAndTypeName,
    },
  ],
}
