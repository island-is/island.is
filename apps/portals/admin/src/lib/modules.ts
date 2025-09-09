import { delegationsModule } from '@island.is/portals/shared-modules/delegations'
import { airDiscountSchemeAdminModule } from '@island.is/portals/admin/air-discount-scheme'
import { regulationAdminModule } from '@island.is/portals/admin/regulations-admin'
import { PortalModule } from '@island.is/portals/core'
import { icelandicNamesRegistryModule } from '@island.is/portals/admin/icelandic-names-registry'
import { documentProviderModule } from '@island.is/portals/admin/document-provider'
import { applicationSystemAdminModule } from '@island.is/portals/admin/application-system'
import { idsAdminModule } from '@island.is/portals/admin/ids-admin'
import { petitionModule } from '@island.is/portals/admin/petition'
import { serviceDeskModule } from '@island.is/portals/admin/service-desk'
import { signatureCollectionModule } from '@island.is/portals/admin/signature-collection'
import { formSystemModule } from '@island.is/portals/admin/form-system'
import { delegationAdminModule } from 'delegation-admin'
import { paymentsModule } from '@island.is/portals/admin/payments'

/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 */

export const modules: PortalModule[] = [
  delegationsModule,
  airDiscountSchemeAdminModule,
  regulationAdminModule,
  icelandicNamesRegistryModule,
  documentProviderModule,
  applicationSystemAdminModule,
  idsAdminModule,
  petitionModule,
  serviceDeskModule,
  signatureCollectionModule,
  formSystemModule,
  delegationAdminModule,
  paymentsModule,
]
