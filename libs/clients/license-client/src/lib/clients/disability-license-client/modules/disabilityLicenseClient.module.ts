import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'
import { Module } from '@nestjs/common'
import { DisabilityLicenseClient } from '../services/disabilityLicenseClient.service'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    DisabilityLicenseClientModule,
    smartSolutionsModuleFactory(DisabilityDigitalLicenseClientConfig),
  ],
  providers: [DisabilityLicenseClient],
  exports: [DisabilityLicenseClient],
})
export class DisabilityClientModule {}
