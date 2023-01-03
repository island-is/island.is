import { PortalNavigationItem, m } from '@island.is/portals/core'
import { ServicePortalPaths } from './paths'
import { documentsNavigation } from '@island.is/service-portal/documents'
import { financeNavigation } from '@island.is/service-portal/finance'

export const rootNavigationItem: PortalNavigationItem = {
  name: m.overview,
  systemRoute: true,
  path: ServicePortalPaths.Root,
  icon: {
    icon: 'home',
  },
}

export const MAIN_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    // Pósthólf
    documentsNavigation,
    financeNavigation,
  ],
}
