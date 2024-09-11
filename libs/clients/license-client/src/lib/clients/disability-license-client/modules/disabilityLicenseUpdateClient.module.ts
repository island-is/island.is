import { Module } from '@nestjs/common'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'
import { DisabilityLicenseUpdateClient } from '../services/disabilityLicenseUpdateClient.service'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [smartSolutionsModuleFactory(DisabilityDigitalLicenseClientConfig)],
  providers: [DisabilityLicenseUpdateClient],
  exports: [DisabilityLicenseUpdateClient],
})
export class DisabilityUpdateClientModule {}
