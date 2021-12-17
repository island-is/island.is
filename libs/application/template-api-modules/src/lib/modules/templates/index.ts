import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { InstitutionCollaborationModule } from './institution-collaboration/institution-collaboration.module'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { ChildrenResidenceChangeModule } from './children-residence-change/children-residence-change.module'
import { LoginServiceModule } from './login-service/login-service.module'
import { FundingGovernmentProjectsModule } from './funding-government-projects/funding-government-projects.module'
import { DrivingLicenseSubmissionModule } from './driving-license-submission/driving-license-submission.module'
import { PayableDummyTemplateModule } from './payable-dummy-template/payable-dummy-template.module'
import { AccidentNotificationModule } from './accident-notification/accident-notification.module'
import { PublicDebtPaymentPlanTemplateModule } from './public-debt-payment-plan/public-debt-payment-plan.module'
import { GeneralPetitionModule } from './general-petition/general-petition.module'
import { CriminalRecordSubmissionModule } from './criminal-record-submission/criminal-record-submission.module'
import { GeneralFishingLicenseModule } from './general-fishing-license/general-fishing-license.module'

export const modules = [
  ReferenceTemplateModule,
  ParentalLeaveModule,
  DocumentProviderOnboardingModule,
  InstitutionCollaborationModule,
  HealthInsuranceModule,
  ChildrenResidenceChangeModule,
  LoginServiceModule,
  FundingGovernmentProjectsModule,
  DrivingLicenseSubmissionModule,
  PayableDummyTemplateModule,
  AccidentNotificationModule,
  PublicDebtPaymentPlanTemplateModule,
  GeneralPetitionModule,
  CriminalRecordSubmissionModule,
  GeneralFishingLicenseModule,
]

export { ReferenceTemplateService } from './reference-template/reference-template.service'
export { ParentalLeaveService } from './parental-leave/parental-leave.service'
export { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
export { InstitutionCollaborationService } from './institution-collaboration/institution-collaboration.service'
export { HealthInsuranceService } from './health-insurance/health-insurance.service'
export { ChildrenResidenceChangeService } from './children-residence-change/children-residence-change.service'
export { LoginServiceService } from './login-service/login-service.service'
export { FundingGovernmentProjectsService } from './funding-government-projects/funding-government-projects.service'
export { DrivingLicenseSubmissionService } from './driving-license-submission/driving-license-submission.service'
export { PayableDummyTemplateService } from './payable-dummy-template/payable-dummy-template.service'
export { AccidentNotificationService } from './accident-notification/accident-notification.service'
export { PublicDebtPaymentPlanTemplateService } from './public-debt-payment-plan/public-debt-payment-plan.service'
export { GeneralPetitionService } from './general-petition/general-petition.service'
export { CriminalRecordSubmissionService } from './criminal-record-submission/criminal-record-submission.service'
export { GeneralFishingLicenseService } from './general-fishing-license/general-fishing-license.service'
