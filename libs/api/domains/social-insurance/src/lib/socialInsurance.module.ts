import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { CmsModule } from '@island.is/cms'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import {
  GeneralResolver,
  IncomePlanResolver,
  MedicalDocumentsResolver,
  PaymentPlanResolver,
  PensionResolver,
} from './resolvers'
import { SocialInsuranceService } from './socialInsurance.service'

@Module({
  imports: [
    SocialInsuranceAdministrationClientModule,
    FeatureFlagModule,
    CmsModule,
  ],
  providers: [
    PaymentPlanResolver,
    PensionResolver,
    IncomePlanResolver,
    SocialInsuranceService,
    GeneralResolver,
    MedicalDocumentsResolver,
  ],
})
export class SocialInsuranceModule {}
