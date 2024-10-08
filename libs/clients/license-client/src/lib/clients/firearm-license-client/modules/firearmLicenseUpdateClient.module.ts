import { Module } from '@nestjs/common'
import { FirearmLicenseUpdateClientModule } from '@island.is/clients/firearm-license'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'
import { PkPassModule } from '../../pk-pass-client/pkPass.module'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { FirearmLicenseUpdateClientV2 } from '../services/firearmLicenseUpdateClientV2.service'

@Module({
  imports: [
    FirearmLicenseUpdateClientModule,
    SmartSolutionsFirearmModule,
    PkPassModule,
  ],
  providers: [FirearmLicenseUpdateClient, FirearmLicenseUpdateClientV2],
  exports: [FirearmLicenseUpdateClient, FirearmLicenseUpdateClientV2],
})
export class FirearmUpdateClientModule {}
