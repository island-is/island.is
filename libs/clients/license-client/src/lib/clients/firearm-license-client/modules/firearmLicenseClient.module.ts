import { FirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { Module } from '@nestjs/common'
import { FirearmLicenseClient } from '../services/firearmLicenseClient.service'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'

@Module({
  imports: [
    FirearmLicenseClientModule,
    smartSolutionsModuleFactory(FirearmDigitalLicenseClientConfig),
  ],
  providers: [FirearmLicenseClient],
  exports: [FirearmLicenseClient],
})
export class FirearmClientModule {}
