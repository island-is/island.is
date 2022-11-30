import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleLicensePlateService } from './order-vehicle-license-plate.service'
import { OrderVehicleLicensePlateApiModule } from '@island.is/api/domains/transport-authority/order-vehicle-license-plate'

export class OrderVehicleRegistrationCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleRegistrationCertificateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        OrderVehicleLicensePlateApiModule,
      ],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
