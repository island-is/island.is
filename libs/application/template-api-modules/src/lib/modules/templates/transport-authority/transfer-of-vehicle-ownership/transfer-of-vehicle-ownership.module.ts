import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
import { TransferOfVehicleOwnershipApiModule } from '@island.is/api/domains/transport-authority/transfer-of-vehicle-ownership'

export class TransferOfVehicleOwnershipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfVehicleOwnershipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        TransferOfVehicleOwnershipApiModule,
      ],
      providers: [TransferOfVehicleOwnershipService],
      exports: [TransferOfVehicleOwnershipService],
    }
  }
}
