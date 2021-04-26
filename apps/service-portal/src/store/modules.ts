import { ServicePortalModule } from '@island.is/service-portal/core'
import { documentProviderModule } from '@island.is/service-portal/document-provider'
import { documentsModule } from '@island.is/service-portal/documents'
import { familyModule } from '@island.is/service-portal/family'
import { financeModule } from '@island.is/service-portal/finance'
import { settingsModule } from '@island.is/service-portal/settings'
import { educationModule } from '@island.is/service-portal/education'
import { educationLicenseModule } from '@island.is/service-portal/education-license'
import { endorsementsModule } from '@island.is/service-portal/endorsements'
import { educationDegreeModule } from '@island.is/service-portal/education-degree'
import { educationCareerModule } from '@island.is/service-portal/education-career'
import { educationStudentAssessmentModule } from '@island.is/service-portal/education-student-assessment'
import { applicationsModule } from '@island.is/service-portal/applications'

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
  | 'documentProvider'
  | 'documents'
  | 'family'
  | 'finance'
  | 'settings'
  | 'education'
  | 'educationLicense'
  | 'endorsements'
  | 'educationCareer'
  | 'educationStudentAssessment'
  | 'applications'

export const featureFlaggedModules: ModuleKeys[] = [
  'documentProvider',
  'education',
  'educationLicense',
  'educationCareer',
  'educationStudentAssessment',
]

export const modules: Record<ModuleKeys, ServicePortalModule> = {
  documentProvider: documentProviderModule,
  documents: documentsModule,
  family: familyModule,
  finance: financeModule,
  settings: settingsModule,
  education: educationModule,
  educationLicense: educationLicenseModule,
  endorsements: endorsementsModule,
  educationCareer: educationCareerModule,
  educationStudentAssessment: educationStudentAssessmentModule,
  applications: applicationsModule,
}
