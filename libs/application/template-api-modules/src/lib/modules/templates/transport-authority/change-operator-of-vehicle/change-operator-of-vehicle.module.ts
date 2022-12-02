import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'

export class ChangeOperatorOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeOperatorOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOperatorsClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleOperatorsClientConfig],
        }),
      ],
      providers: [ChangeOperatorOfVehicleService],
      exports: [ChangeOperatorOfVehicleService],
    }
  }
}
