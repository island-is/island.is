import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientService } from './socialInsuranceAdministrationClient.service'
import { apiProvider, ApplicationV2ApiProvider } from './apiProvider'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [FeatureFlagModule],
  providers: [
    ...apiProvider,
    ApplicationV2ApiProvider,
    SocialInsuranceAdministrationClientService,
  ],
  exports: [SocialInsuranceAdministrationClientService],
})
export class SocialInsuranceAdministrationClientModule {}
