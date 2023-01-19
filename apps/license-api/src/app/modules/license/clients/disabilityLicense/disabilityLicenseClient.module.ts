import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DisabilityLicenseClientConfig } from './disabilityLicenseClient.config'
import { DisabilityLicenseClientService } from './disabilityLicenseClient.service'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof DisabilityLicenseClientConfig>) =>
        config,
      inject: [DisabilityLicenseClientConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseClientService],
  exports: [DisabilityLicenseClientService],
})
export class DisabilityLicenseApiClientModule {}
