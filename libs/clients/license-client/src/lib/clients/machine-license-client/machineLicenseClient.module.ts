import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { MachineLicenseClient } from './machineLicenseClient.service'
import { MachineDigitalLicenseClientConfig } from './machineLicenseClient.config'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'
import { PkPassService } from '../../helpers/pk-pass-service/pkPass.service'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof MachineDigitalLicenseClientConfig>,
      ) => config,
      inject: [MachineDigitalLicenseClientConfig.KEY],
    }),
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof MachineDigitalLicenseClientConfig>,
      ) => ({
        config,
      }),
      inject: [MachineDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [PkPassService, MachineLicenseClient],
  exports: [MachineLicenseClient],
})
export class MachineClientModule {}
