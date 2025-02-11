import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'
import { DisabilityLicenseUpdateClient } from '../services/disabilityLicenseUpdateClient.service'
import { DisabilityLicenseUpdateClientV2 } from '../services/disabilityLicenseUpdateClientV2.service'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

@Module({
  imports: [
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
