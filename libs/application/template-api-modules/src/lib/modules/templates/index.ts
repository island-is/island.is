import { ReferenceTemplateModule } from './reference-template/reference-template.module'
import { ParentalLeaveModule } from './parental-leave/parental-leave.module'
import { DocumentProviderOnboardingModule } from './document-provider-onboarding/document-provider-onboarding.module'
import { InstitutionApplicationModule } from './institution-application/institution-application.module'
import { HealthInsuranceModule } from './health-insurance/health-insurance.module'

export const modules = [
  ReferenceTemplateModule,
  ParentalLeaveModule,
  DocumentProviderOnboardingModule,
  InstitutionApplicationModule,
  HealthInsuranceModule,
]

export { ReferenceTemplateService } from './reference-template/reference-template.service'
export { ParentalLeaveService } from './parental-leave/parental-leave.service'
export { DocumentProviderOnboardingService } from './document-provider-onboarding/document-provider-onboarding.service'
export { InstitutionApplicationService } from './institution-application/institution-application.service'
export { HealthInsuranceService } from './health-insurance/health-insurance.service'
