import { icelandicNamesRegistryNavigation } from '@island.is/portals/admin/icelandic-names-registry'
import { airDiscountSchemeNavigation } from '@island.is/portals/admin/air-discount-scheme'
import { regulationAdminNavigation } from '@island.is/portals/admin/regulations-admin'
import { applicationSystemNavigation } from '@island.is/portals/admin/application-system'
import {
  PortalNavigationItem,
  m as coreMessages,
} from '@island.is/portals/core'
import { documentProviderNavigation } from '@island.is/portals/admin/document-provider'
import { delegationsNavigation } from '@island.is/portals/shared-modules/delegations'
import { AdminPortalPaths } from './paths'
import { idsAdminNavigation } from '@island.is/portals/admin/ids-admin'
import { signatureCollectionNavigation } from '@island.is/portals/admin/signature-collection'
import { serviceDeskNavigation } from '@island.is/portals/admin/service-desk'
import { petitionNavigation } from '@island.is/portals/admin/petition'
import { formSystemNavigation } from '@island.is/portals/admin/form-system'
import { delegationAdminNav } from 'delegation-admin'
import { paymentsNavigation } from '@island.is/portals/admin/payments'

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
    // Mannanafnaskrá
    icelandicNamesRegistryNavigation,
    // Skjalaveita
    documentProviderNavigation,
    // Umsoknarkerfi
    applicationSystemNavigation,
    // IDS Admin
    idsAdminNavigation,
    // Undirskriftalistar
    petitionNavigation,
    // Þjónustuborð
    serviceDeskNavigation,
    // Meðmælasöfnun
    signatureCollectionNavigation,
    // Formakerfi
    formSystemNavigation,
    // Aðgangsstýring umboð
    delegationAdminNav,
    // Greiðslur
    paymentsNavigation,
  ],
}
export const BOTTOM_NAVIGATION: PortalNavigationItem = {
  ...rootNavigationItem,
  children: [
    // Aðgangsstýring umboð
    delegationsNavigation,
  ],
}
