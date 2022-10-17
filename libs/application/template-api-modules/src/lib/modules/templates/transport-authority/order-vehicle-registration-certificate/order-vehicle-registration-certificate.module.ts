import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleLicensePlateService } from './order-vehicle-registration-certificate.service'

export class OrderVehicleLicensePlateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleLicensePlateModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
