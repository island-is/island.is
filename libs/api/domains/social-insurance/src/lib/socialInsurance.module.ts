import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { SocialInsuranceResolver } from './socialInsurance.resolver'
import { SocialInsuranceService } from './socialInsurance.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [SocialInsuranceAdministrationClientModule, FeatureFlagModule],
  providers: [SocialInsuranceResolver, SocialInsuranceService],
})
export class SocialInsuranceModule {}
