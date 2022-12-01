import { delegationsModule } from '@island.is/portals/shared-modules/delegations'
import { airDiscountSchemeAdminModule } from '@island.is/portals/admin/air-discount-scheme'
import { PortalModule } from '@island.is/portals/core'

/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 */

export const modules: PortalModule[] = [
  delegationsModule,
  airDiscountSchemeAdminModule,
]
