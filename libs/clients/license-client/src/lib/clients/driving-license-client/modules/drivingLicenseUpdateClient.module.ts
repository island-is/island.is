import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseUpdateClient } from '../services/drivingLicenseUpdateClient.service'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseUpdateClientV2 } from '../services/drivingLicenseUpdateClientV2.service'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions-v2'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

@Module({
  imports: [
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => config,
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => ({
        config,
      }),
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [
    PkPassService,
    DrivingLicenseUpdateClient,
    DrivingLicenseUpdateClientV2,
  ],
  exports: [DrivingLicenseUpdateClient, DrivingLicenseUpdateClientV2],
})
export class DrivingUpdateClientModule {}
