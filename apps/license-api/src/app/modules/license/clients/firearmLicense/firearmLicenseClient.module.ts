import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseClientConfig } from './firearmLicenseClient.config'
import { FirearmLicenseClientService } from './firearmLicenseClient.service'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof FirearmLicenseClientConfig>) =>
        config,
      inject: [FirearmLicenseClientConfig.KEY],
    }),
  ],
  providers: [FirearmLicenseClientService],
  exports: [FirearmLicenseClientService],
})
export class FirearmLicenseClientModule {}
