import { Module } from '@nestjs/common'
import { FirearmLicenseUpdateClientModule } from '@island.is/clients/firearm-license'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'

@Module({
  imports: [
    FirearmLicenseUpdateClientModule,
    smartSolutionsModuleFactory(FirearmDigitalLicenseClientConfig),
  ],
  providers: [FirearmLicenseUpdateClient],
  exports: [FirearmLicenseUpdateClient],
})
export class FirearmUpdateClientModule {}
