import { Module } from '@nestjs/common'
import { FirearmLicenseUpdateClientModule } from '@island.is/clients/firearm-license'
import { SmartSolutionsFirearmModule } from './smartSolutionsFirearm.module'
import { FirearmLicenseUpdateClientV2 } from '../services/firearmLicenseUpdateClientV2.service'
import { FirearmLicenseUpdateClient } from '../services/firearmLicenseUpdateClient.service'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'
import { ConfigType } from '@nestjs/config'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

@Module({
  imports: [
    FirearmLicenseUpdateClientModule,
    SmartSolutionsFirearmModule,
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
      ) => ({
        config,
      }),
      inject: [FirearmDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [
    PkPassService,
    FirearmLicenseUpdateClient,
    FirearmLicenseUpdateClientV2,
  ],
  exports: [FirearmLicenseUpdateClient, FirearmLicenseUpdateClientV2],
})
export class FirearmUpdateClientModule {}
