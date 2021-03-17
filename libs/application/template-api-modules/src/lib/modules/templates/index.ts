import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'
import { DataProtectionComplaintModule } from './data-protection-complaint/data-protection-complaint.module'
import { ChildrenResidenceChangeModule } from './children-residence-change/children-residence-change.module'

export const modules = [
  ReferenceTemplateModule,
  ParentalLeaveModule,
  DocumentProviderOnboardingModule,
  HealthInsuranceModule,
  DataProtectionComplaintModule,
  ChildrenResidenceChangeModule,
]

export { ReferenceTemplateService } from './reference-template/reference-template.service'
export { ParentalLeaveService } from './parental-leave/parental-leave.service'
export { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
export { HealthInsuranceService } from './health-insurance/health-insurance.service'
export { ChildrenResidenceChangeService } from './children-residence-change/children-residence-change.service'
export { DataProtectionComplaintService } from './data-protection-complaint/data-protection-complaint.service'
