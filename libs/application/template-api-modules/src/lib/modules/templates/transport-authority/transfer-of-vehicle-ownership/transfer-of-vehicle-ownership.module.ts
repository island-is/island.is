import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'

export class TransferOfVehicleOwnershipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfVehicleOwnershipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        VehicleCodetablesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleOwnerChangeClientConfig, VehicleCodetablesClientConfig],
        }),
      ],
      providers: [TransferOfVehicleOwnershipService],
      exports: [TransferOfVehicleOwnershipService],
    }
  }
}
