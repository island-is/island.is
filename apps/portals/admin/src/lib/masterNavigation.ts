import { icelandicNamesRegistryNavigation } from '@island.is/portals/admin/icelandic-names-registry'
import { airDiscountSchemeNavigation } from '@island.is/portals/admin/air-discount-scheme'
import {
  PortalNavigationItem,
  m as coreMessages,
} from '@island.is/portals/core'
import { documentProviderNavigation } from '@island.is/portals/admin/document-provider'
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
    // Mannanafnaskrá
    icelandicNamesRegistryNavigation,
    // Skjalaveita
    documentProviderNavigation,
  ],
}
export const BOTTOM_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    // Aðgangsstýring umboð
    delegationsNavigation,
  ],
}
