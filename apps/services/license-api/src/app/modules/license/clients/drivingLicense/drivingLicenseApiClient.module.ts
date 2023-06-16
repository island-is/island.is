import { Module } from '@nestjs/common'
import { CacheModule } from '@island.is/cache'
import { DrivingLicenseApiClientService } from './drivingLicenseApiClient.service'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseApiClientConfig } from './drivingLicenseApiClient.config'

@Module({
  imports: [
    CacheModule.register(),
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof DrivingLicenseApiClientConfig>) =>
        config,
      inject: [DrivingLicenseApiClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseApiClientService],
  exports: [DrivingLicenseApiClientService],
})
export class DrivingLicenseApiClientModule {}
