import { PortalModule } from '@island.is/portals/core'
import { restrictionsModule } from '@island.is/portals/my-pages/restrictions'
import { sessionsModule } from '@island.is/portals/my-pages/sessions'
import { applicationsModule } from '@island.is/portals/my-pages/applications'
import { assetsModule } from '@island.is/portals/my-pages/assets'
import { documentsModule } from '@island.is/portals/my-pages/documents'
import { educationModule } from '@island.is/portals/my-pages/education'
import { educationCareerModule } from '@island.is/portals/my-pages/education-career'
import { educationStudentAssessmentModule } from '@island.is/portals/my-pages/education-student-assessment'
import { financeModule } from '@island.is/portals/my-pages/finance'
import { petitionsModule } from '@island.is/portals/my-pages/petitions'
import { informationModule } from '@island.is/portals/my-pages/information'
import { licensesModule } from '@island.is/portals/my-pages/licenses'
import { airDiscountModule } from '@island.is/portals/my-pages/air-discount'
import { delegationsModule } from '@island.is/portals/shared-modules/delegations'
import { healthModule } from '@island.is/portals/my-pages/health'
import { indexModule } from '../module'
import { consentModule } from '@island.is/portals/my-pages/consent'
import { occupationalLicensesModule } from '@island.is/portals/my-pages/occupational-licenses'
import { signatureCollectionModule } from '@island.is/portals/my-pages/signature-collection'
import { socialInsuranceMaintenanceModule } from '@island.is/portals/my-pages/social-insurance-maintenance'
import { lawAndOrderModule } from '@island.is/portals/my-pages/law-and-order'
import { mileageRegistrationModule } from '@island.is/portals/my-pages/mileage-registration'

/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be featured flagged.
 */
export const modules: PortalModule[] = [
  airDiscountModule,
  applicationsModule,
  assetsModule,
  consentModule,
  delegationsModule,
  documentsModule,
  educationCareerModule,
  educationModule,
  educationStudentAssessmentModule,
  financeModule,
  healthModule,
  indexModule,
  informationModule,
  licensesModule,
  mileageRegistrationModule,
  occupationalLicensesModule,
  restrictionsModule,
  sessionsModule,
  socialInsuranceMaintenanceModule,
  signatureCollectionModule,
  petitionsModule,
  lawAndOrderModule,
]
