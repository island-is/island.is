import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { AdrLicenseClient } from './adrLicenseClient.service'
import { AdrDigitalLicenseClientConfig } from './adrLicenseClient.config'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof AdrDigitalLicenseClientConfig>) =>
        config,
      inject: [AdrDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [AdrLicenseClient],
  exports: [AdrLicenseClient],
})
export class AdrClientModule {}
