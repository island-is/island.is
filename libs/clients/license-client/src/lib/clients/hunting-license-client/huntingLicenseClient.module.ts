import { HuntingLicenseClientModule } from '@island.is/clients/hunting-license'
import { Module } from '@nestjs/common'
import { HuntingDigitalLicenseClientConfig } from './huntingLicenseClient.config'
import { HuntingLicenseClient } from './huntingLicenseClient.service'
import { smartSolutionsModuleFactory } from '../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    HuntingLicenseClientModule,
    smartSolutionsModuleFactory(HuntingDigitalLicenseClientConfig),
  ],
  providers: [HuntingLicenseClient],
  exports: [HuntingLicenseClient],
})
export class HuntingClientModule {}
