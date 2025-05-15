import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { CmsModule } from '@island.is/cms'
import { SocialInsuranceService } from './socialInsurance.service'
import {
  GeneralResolver,
  IncomePlanResolver,
  PaymentPlanResolver,
  PensionResolver,
} from './resolvers'

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
  ],
})
export class SocialInsuranceModule {}
