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
}
