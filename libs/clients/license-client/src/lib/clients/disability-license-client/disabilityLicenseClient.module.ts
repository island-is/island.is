import {
  DisabilityLicenseApiProvider,
  DisabilityLicenseClientModule,
} from '@island.is/clients/disability-license'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityDigitalLicenseConfig } from './disabilityLicenseClient.config'
import { DisabilityLicenseClient } from './disabilityLicenseClient.service'

@Module({
  imports: [
    DisabilityLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof DisabilityDigitalLicenseConfig>) =>
        config,
      inject: [DisabilityDigitalLicenseConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseClient, DisabilityLicenseApiProvider],
  exports: [DisabilityLicenseClient],
})
export class DisabilityClientModule {}
