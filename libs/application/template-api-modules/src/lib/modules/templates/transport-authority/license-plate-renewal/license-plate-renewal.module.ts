import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { LicensePlateRenewalService } from './license-plate-renewal.service'
import {
  VehiclePlateRenewalClientModule,
  VehiclePlateRenewalClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehiclePlateRenewalClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclePlateRenewalClientConfig],
    }),
  ],
  providers: [LicensePlateRenewalService],
  exports: [LicensePlateRenewalService],
})
export class LicensePlateRenewalModule {}
