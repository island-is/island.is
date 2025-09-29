import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientService } from './socialInsuranceAdministrationClient.service'
import { apiProvider } from './apiProvider'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [FeatureFlagModule],
  providers: [...apiProvider, SocialInsuranceAdministrationClientService],
  exports: [SocialInsuranceAdministrationClientService],
})
export class SocialInsuranceAdministrationClientModule {}
