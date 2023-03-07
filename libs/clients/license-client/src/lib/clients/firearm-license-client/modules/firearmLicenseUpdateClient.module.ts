import { Module } from '@nestjs/common'
import { FirearmLicenseUpdateClientModule } from '@island.is/clients/firearm-license'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'

@Module({
  imports: [FirearmLicenseUpdateClientModule, SmartSolutionsFirearmModule],
  providers: [FirearmLicenseUpdateClient],
  exports: [FirearmLicenseUpdateClient],
})
export class FirearmUpdateClientModule {}
