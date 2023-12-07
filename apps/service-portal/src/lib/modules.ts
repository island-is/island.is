import { PortalModule } from '@island.is/portals/core'
import { sessionsModule } from '@island.is/service-portal/sessions'
import { applicationsModule } from '@island.is/service-portal/applications'
import { assetsModule } from '@island.is/service-portal/assets'
import { documentsModule } from '@island.is/service-portal/documents'
import { educationModule } from '@island.is/service-portal/education'
import { educationCareerModule } from '@island.is/service-portal/education-career'
import { educationStudentAssessmentModule } from '@island.is/service-portal/education-student-assessment'
import { financeModule } from '@island.is/service-portal/finance'
import { petitionsModule } from '@island.is/service-portal/petitions'
import { informationModule } from '@island.is/service-portal/information'
import { licensesModule } from '@island.is/service-portal/licenses'
import { airDiscountModule } from '@island.is/service-portal/air-discount'
import { delegationsModule } from '@island.is/portals/shared-modules/delegations'
import { healthModule } from '@island.is/service-portal/health'
import { indexModule } from '../screens/Dashboard/module'
import { consentModule } from '@island.is/service-portal/consent'
import { occupationalLicensesModule } from '@island.is/service-portal/occupational-licenses'
import { signatureCollectionModule } from '@island.is/service-portal/signature-collection'
/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 */
export const modules: PortalModule[] = [
  applicationsModule,
  assetsModule,
  documentsModule,
  educationModule,
  educationCareerModule,
  occupationalLicensesModule,
  educationStudentAssessmentModule,
  delegationsModule,
  financeModule,
  informationModule,
  petitionsModule,
  signatureCollectionModule,
  airDiscountModule,
  licensesModule,
  sessionsModule,
  healthModule,
  indexModule,
  consentModule,
]
