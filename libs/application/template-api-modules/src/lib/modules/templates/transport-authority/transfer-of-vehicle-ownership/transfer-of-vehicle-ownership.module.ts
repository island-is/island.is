import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'

export class TransferOfVehicleOwnershipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfVehicleOwnershipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleOwnerChangeClientConfig],
        }),
      ],
      providers: [TransferOfVehicleOwnershipService],
      exports: [TransferOfVehicleOwnershipService],
    }
  }
}
