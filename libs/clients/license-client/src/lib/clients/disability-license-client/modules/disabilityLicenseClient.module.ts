import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityLicenseClient } from '../services/disabilityLicenseClient.service'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'

@Module({
  imports: [
    DisabilityLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
      ) => config,
      inject: [DisabilityDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseClient],
  exports: [DisabilityLicenseClient],
})
export class DisabilityClientModule {}
