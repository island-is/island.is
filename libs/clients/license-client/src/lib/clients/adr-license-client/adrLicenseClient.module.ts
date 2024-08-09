import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'

import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { AdrLicenseClient } from './adrLicenseClient.service'
import { AdrDigitalLicenseClientConfig } from './adrLicenseClient.config'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof AdrDigitalLicenseClientConfig>,
      ) => {
        return {
          config,
        }
      },
      inject: [AdrDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [AdrLicenseClient],
  exports: [AdrLicenseClient],
})
export class AdrClientModule {}
