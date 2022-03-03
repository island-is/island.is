import { applicationsModule } from '@island.is/service-portal/applications'
import { assetsModule } from '@island.is/service-portal/assets'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { documentProviderModule } from '@island.is/service-portal/document-provider'
import { documentsModule } from '@island.is/service-portal/documents'
import { educationModule } from '@island.is/service-portal/education'
import { educationCareerModule } from '@island.is/service-portal/education-career'
import { educationLicenseModule } from '@island.is/service-portal/education-license'
import { educationStudentAssessmentModule } from '@island.is/service-portal/education-student-assessment'
import { petitionsModule } from '@island.is/service-portal/endorsements'
import { familyModule } from '@island.is/service-portal/family'
import { financeModule } from '@island.is/service-portal/finance'
import { icelandicNamesRegistryModule } from '@island.is/service-portal/icelandic-names-registry'
import { licensesModule } from '@island.is/service-portal/licenses'
import { accessControlModule } from '@island.is/service-portal/settings/access-control'
import { personalInformationModule } from '@island.is/service-portal/settings/personal-information'
import { wipModule } from '@island.is/service-portal/wip'

/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 *
 * To feature flag a module add it to the featureFlaggedModules below
 * and create a feature flag in ConfigCat called
 * `isServicePortalFinanceModuleEnabled` where your module is called `finance`.
 */

export type ModuleKeys =
  | 'accessControl'
  | 'documentProvider'
  | 'documents'
  | 'family'
  | 'finance'
  | 'icelandicNamesRegistry'
  | 'personalInformation'
  | 'education'
  | 'educationLicense'
  | 'educationCareer'
  | 'educationStudentAssessment'
  | 'assets'
  | 'applications'
  | 'licenses'
  | 'wip'
  | 'petitions'

export const featureFlaggedModules: ModuleKeys[] = [
  'accessControl',
  'documentProvider',
  'icelandicNamesRegistry',
  'personalInformation',
  'licenses',
  'petitions',
]

export const modules: Record<ModuleKeys, ServicePortalModule> = {
  documentProvider: documentProviderModule,
  documents: documentsModule,
  family: familyModule,
  finance: financeModule,
  icelandicNamesRegistry: icelandicNamesRegistryModule,
  personalInformation: personalInformationModule,
  education: educationModule,
  educationLicense: educationLicenseModule,
  petitions: petitionsModule,
  educationCareer: educationCareerModule,
  educationStudentAssessment: educationStudentAssessmentModule,
  assets: assetsModule,
  applications: applicationsModule,
  accessControl: accessControlModule,
  licenses: licensesModule,
  wip: wipModule,
}
