import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'

export class ChangeOperatorOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeOperatorOfVehicleModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [ChangeOperatorOfVehicleService],
      exports: [ChangeOperatorOfVehicleService],
    }
  }
}
