import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import { Module } from '@nestjs/common'
import { MachineLicenseClient } from './machineLicenseClient.service'
import { MachineDigitalLicenseClientConfig } from './machineLicenseClient.config'
import { smartSolutionsModuleFactory } from '../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    smartSolutionsModuleFactory(MachineDigitalLicenseClientConfig),
  ],
  providers: [MachineLicenseClient],
  exports: [MachineLicenseClient],
})
export class MachineClientModule {}
