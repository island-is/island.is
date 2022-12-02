import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleLicensePlateService } from './order-vehicle-license-plate.service'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'

export class OrderVehicleRegistrationCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleRegistrationCertificateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePlateOrderingClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclePlateOrderingClientConfig],
        }),
      ],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
