import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import { Module } from '@nestjs/common'
import { AdrLicenseClient } from './adrLicenseClient.service'
import { AdrDigitalLicenseClientConfig } from './adrLicenseClient.config'
import { smartSolutionsModuleFactory } from '../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    smartSolutionsModuleFactory(AdrDigitalLicenseClientConfig),
  ],
  providers: [AdrLicenseClient],
  exports: [AdrLicenseClient],
})
export class AdrClientModule {}
