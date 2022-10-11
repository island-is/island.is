import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeCoOwnerOfVehicleService } from './change-co-owner-of-vehicle.service'

export class ChangeCoOwnerOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeCoOwnerOfVehicleModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [ChangeCoOwnerOfVehicleService],
      exports: [ChangeCoOwnerOfVehicleService],
    }
  }
}
