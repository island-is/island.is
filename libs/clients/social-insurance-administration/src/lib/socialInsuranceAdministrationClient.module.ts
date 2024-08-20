import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientService } from './socialInsuranceAdministrationClient.service'
import { apiProvider } from './apiProvider'

@Module({
  providers: [...apiProvider, SocialInsuranceAdministrationClientService],
  exports: [SocialInsuranceAdministrationClientService],
})
export class SocialInsuranceAdministrationClientModule {}
