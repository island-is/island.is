import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientService } from './services/deprecated/socialInsuranceAdministrationClient.service'
import { apiProvider, ApplicationV2ApiProvider } from './apiProvider'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { SocialInsuranceAdministrationGeneralApplicationService } from './services/applicationServices/generalApplication.service'
import { SocialInsuranceAdministrationDisabilityPensionService } from './services/applicationServices/disabilityPension.service'
import { SocialInsuranceAdministrationMedicalAndRehabilitationService } from './services/applicationServices/medicalAndRehabilitation.service'
import { SocialInsuranceAdministrationIncomePlanService } from './services/incomePlan.service'
import { SocialInsuranceAdministrationPaymentPlanService } from './services/paymentPlan.service'
import { SocialInsuranceAdministrationBankInformationService } from './services/bankInformation.service'
import { SocialInsuranceAdministrationGeneralService } from './services/general.service'
import { SocialInsuranceAdministrationEmploymentService } from './services/employment.service'
import { SocialInsuranceAdministrationProfessionService } from './services/profession.service'
import { SocialInsuranceAdministrationEducationService } from './services/education.service'
import { SocialInsuranceAdministrationPensionCalculatorService } from './services/pensionCalculator.service'
import { SocialInsuranceAdministrationDeathBenefitsService } from './services/deathBenefits.service'
import { SocialInsuranceAdministrationMedicalDocumentsService } from './services/medicalDocuments.service'

@Module({
  imports: [FeatureFlagModule],
  providers: [
    ...apiProvider,
    ApplicationV2ApiProvider,
    SocialInsuranceAdministrationClientService,
    SocialInsuranceAdministrationGeneralApplicationService,
    SocialInsuranceAdministrationIncomePlanService,
    SocialInsuranceAdministrationPaymentPlanService,
    SocialInsuranceAdministrationBankInformationService,
    SocialInsuranceAdministrationGeneralService,
    SocialInsuranceAdministrationEmploymentService,
    SocialInsuranceAdministrationProfessionService,
    SocialInsuranceAdministrationEducationService,
    SocialInsuranceAdministrationPensionCalculatorService,
    SocialInsuranceAdministrationDeathBenefitsService,
    SocialInsuranceAdministrationMedicalDocumentsService,
    SocialInsuranceAdministrationDisabilityPensionService,
    SocialInsuranceAdministrationMedicalAndRehabilitationService,
  ],
  exports: [
    SocialInsuranceAdministrationClientService,
    SocialInsuranceAdministrationGeneralApplicationService,
    SocialInsuranceAdministrationIncomePlanService,
    SocialInsuranceAdministrationPaymentPlanService,
    SocialInsuranceAdministrationBankInformationService,
    SocialInsuranceAdministrationGeneralService,
    SocialInsuranceAdministrationEmploymentService,
    SocialInsuranceAdministrationProfessionService,
    SocialInsuranceAdministrationEducationService,
    SocialInsuranceAdministrationPensionCalculatorService,
    SocialInsuranceAdministrationDeathBenefitsService,
    SocialInsuranceAdministrationMedicalDocumentsService,
    SocialInsuranceAdministrationMedicalAndRehabilitationService,
    SocialInsuranceAdministrationDisabilityPensionService,
  ],
})
export class SocialInsuranceAdministrationClientModule {}
