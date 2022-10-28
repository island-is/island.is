import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeCoOwnerOfVehicleService } from './change-co-owner-of-vehicle.service'
import { ChangeCoOwnerOfVehicleApiModule } from '@island.is/api/domains/transport-authority/change-co-owner-of-vehicle'

export class ChangeCoOwnerOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeCoOwnerOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ChangeCoOwnerOfVehicleApiModule,
      ],
      providers: [ChangeCoOwnerOfVehicleService],
      exports: [ChangeCoOwnerOfVehicleService],
    }
  }
}
