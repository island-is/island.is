import { Module } from '@nestjs/common'
import { FirearmLicenseUpdateClientModule } from '@island.is/clients/firearm-license'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'
import { FirearmLicenseUpdateClientV2 } from '../services/firearmLicenseUpdateClientV2.service'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { PkPassService } from '../../../helpers/pkPassService/pkPass.service'

@Module({
  imports: [FirearmLicenseUpdateClientModule, SmartSolutionsFirearmModule],
  providers: [
    PkPassService,
    FirearmLicenseUpdateClient,
    FirearmLicenseUpdateClientV2,
  ],
  exports: [FirearmLicenseUpdateClient, FirearmLicenseUpdateClientV2],
})
export class FirearmUpdateClientModule {}
