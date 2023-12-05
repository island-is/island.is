import { Module } from '@nestjs/common'
import { SocialInsuranceAdministrationClientService } from './socialInsuranceAdministrationClient.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { ConfigModule } from '@island.is/nest/config'
import { SocialInsuranceAdministrationClientConfig } from './socialInsuranceAdministrationClient.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [SocialInsuranceAdministrationClientConfig],
    }),
  ],
  providers: [
    ApiConfiguration,
    ...exportedApis,
    SocialInsuranceAdministrationClientService,
  ],
  exports: [SocialInsuranceAdministrationClientService],
})
export class SocialInsuranceAdministrationClientModule {}
