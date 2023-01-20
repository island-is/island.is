import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { DocumentProviderPaths } from './paths'

export const documentProviderNavigation: PortalNavigationItem = {
  name: m.documentProvider,
  path: DocumentProviderPaths.DocumentProviderRoot,
  icon: {
    icon: 'receipt',
  },
}
