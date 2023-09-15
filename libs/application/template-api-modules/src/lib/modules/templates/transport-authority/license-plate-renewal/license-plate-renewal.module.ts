import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { LicensePlateRenewalService } from './license-plate-renewal.service'
import {
  VehiclePlateRenewalClientModule,
  VehiclePlateRenewalClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'

export class LicensePlateRenewalModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: LicensePlateRenewalModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePlateRenewalClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclePlateRenewalClientConfig],
        }),
      ],
      providers: [LicensePlateRenewalService],
      exports: [LicensePlateRenewalService],
    }
  }
}
