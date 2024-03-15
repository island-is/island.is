import { FirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import { Module } from '@nestjs/common'
import { FirearmLicenseClient } from '../services/firearmLicenseClient.service'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'

@Module({
  imports: [FirearmLicenseClientModule, SmartSolutionsFirearmModule],
  providers: [FirearmLicenseClient],
  exports: [FirearmLicenseClient],
})
export class FirearmClientModule {}
