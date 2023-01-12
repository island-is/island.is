import { airDiscountSchemeNavigation } from '@island.is/portals/admin/air-discount-scheme'
import { regulationAdminNavigation } from '@island.is/portals/admin/regulations-admin'
import {
  PortalNavigationItem,
  m as coreMessages,
} from '@island.is/portals/core'
import { delegationsNavigation } from '@island.is/portals/shared-modules/delegations'
import { AdminPortalPaths } from './paths'

export const rootNavigationItem: PortalNavigationItem = {
  name: coreMessages.overview,
  systemRoute: true,
  path: AdminPortalPaths.Root,
  icon: {
    icon: 'home',
  },
}

export const TOP_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    // Loftbrú
    airDiscountSchemeNavigation,
    regulationAdminNavigation,
  ],
}
export const BOTTOM_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    // Aðgangsstýring umboð
    delegationsNavigation,
  ],
}
