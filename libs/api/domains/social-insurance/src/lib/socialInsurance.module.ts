import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientModule } from '@island.is/clients/social-insurance-administration'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { CmsModule } from '@island.is/cms'
import { SocialInsuranceResolver } from './socialInsurance.resolver'
import { SocialInsuranceService } from './socialInsurance.service'

@Module({
  imports: [
    SocialInsuranceAdministrationClientModule,
    FeatureFlagModule,
    CmsModule,
  ],
  providers: [SocialInsuranceResolver, SocialInsuranceService],
})
export class SocialInsuranceModule {}
