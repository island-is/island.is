import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'
import { ChangeOperatorOfVehicleApiModule } from '@island.is/api/domains/transport-authority/change-operator-of-vehicle'

export class ChangeOperatorOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeOperatorOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ChangeOperatorOfVehicleApiModule,
      ],
      providers: [ChangeOperatorOfVehicleService],
      exports: [ChangeOperatorOfVehicleService],
    }
  }
}
