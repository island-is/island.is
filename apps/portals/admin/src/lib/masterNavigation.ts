import { airDiscountSchemeNavigation } from '@island.is/portals/admin/air-discount-scheme'
import {
  PortalNavigationItem,
  m as coreMessages,
} from '@island.is/portals/core'
import { delegationsNavigation } from '@island.is/portals/shared-modules/delegations'
import { AdminPortalPaths } from './paths'

export const masterNavigation: PortalNavigationItem = {
  name: coreMessages.overview,
  systemRoute: true,
  path: AdminPortalPaths.Root,
  icon: {
    icon: 'home',
  },
  children: [
    // Loftbrú
    airDiscountSchemeNavigation,
    // Aðgangsstýring umboð
    delegationsNavigation,
  ],
}
