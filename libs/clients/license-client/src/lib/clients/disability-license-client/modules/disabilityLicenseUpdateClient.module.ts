import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'
import { DisabilityLicenseUpdateClient } from '../services/disabilityLicenseUpdateClient.service'
import { DisabilityLicenseUpdateClientV2 } from '../services/disabilityLicenseUpdateClientV2.service'
import { PkPassService } from '../../../helpers/pkPassService/pkPass.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'

@Module({
  imports: [
    FeatureFlagModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
      ) => config,
      inject: [DisabilityDigitalLicenseClientConfig.KEY],
    }),
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
      ) => ({
        config,
      }),
      inject: [DisabilityDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [
    PkPassService,
    DisabilityLicenseUpdateClient,
    DisabilityLicenseUpdateClientV2,
  ],
  exports: [DisabilityLicenseUpdateClient, DisabilityLicenseUpdateClientV2],
})
export class DisabilityUpdateClientModule {}
