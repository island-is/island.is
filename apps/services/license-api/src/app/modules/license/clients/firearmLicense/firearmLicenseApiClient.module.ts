import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { OpenFirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseApiClientConfig } from './firearmLicenseApiClient.config'
import { FirearmLicenseApiClientService } from './firearmLicenseApiClient.service'

@Module({
  imports: [
    OpenFirearmLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof FirearmLicenseApiClientConfig>) =>
        config,
      inject: [FirearmLicenseApiClientConfig.KEY],
    }),
  ],
  providers: [FirearmLicenseApiClientService],
  exports: [FirearmLicenseApiClientService],
})
export class FirearmLicenseApiClientModule {}
