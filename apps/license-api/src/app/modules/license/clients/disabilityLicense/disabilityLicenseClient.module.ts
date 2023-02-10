import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DisabilityLicenseClientService } from './disabilityLicenseClient.service'
import { DisabilityLicenseApiClientConfig } from './disabilityLicenseClient.config'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityLicenseApiClientConfig>,
      ) => config,
      inject: [DisabilityLicenseApiClientConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseClientService],
  exports: [DisabilityLicenseClientService],
})
export class DisabilityLicenseApiClientModule {}
