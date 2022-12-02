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
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'

export class TransferOfVehicleOwnershipModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TransferOfVehicleOwnershipModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        ChargeFjsV2ClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleOwnerChangeClientConfig, ChargeFjsV2ClientConfig],
        }),
      ],
      providers: [TransferOfVehicleOwnershipService],
      exports: [TransferOfVehicleOwnershipService],
    }
  }
}
